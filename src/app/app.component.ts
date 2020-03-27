import {
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	QueryList,
	Renderer2,
	ViewChildren,
} from "@angular/core";
import { Router } from "@angular/router";
import {
	Keyboard,
	KeyboardResizeMode,
	KeyboardStyle,
} from "@ionic-native/keyboard/ngx";
import { Network } from "@ionic-native/network/ngx";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import {
	ActionSheetController,
	AlertController,
	Config,
	IonRouterOutlet,
	MenuController,
	ModalController,
	NavController,
	Platform,
} from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import moment from "moment";
import { Subject } from "rxjs";
import { debounceTime, switchMap, takeUntil } from "rxjs/operators";

import * as constants from "@/app/app.constants";
import { Wallet } from "@/models/model";
import { AuthProvider } from "@/services/auth/auth";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataService } from "@/services/user-data/user-data.interface";

import { ArkApiProvider } from "./services/ark-api/ark-api";
import { EventBusProvider } from "./services/event-bus/event-bus";
import { LoggerService } from "./services/logger/logger.service";
import { SettingsDataProvider } from "./services/settings-data/settings-data";

@Component({
	selector: "app-root",
	templateUrl: "app.component.html",
	styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnDestroy, OnInit {
	@ViewChildren(IonRouterOutlet)
	routerOutlets: QueryList<IonRouterOutlet>;

	public profile = null;
	public network = null;

	public exitText: string;
	public signOutText: string;
	public hideRouter = false;

	public menuId = "sidebar";

	private unsubscriber$: Subject<void> = new Subject<void>();
	private lastPauseTimestamp: Date;

	constructor(
		private platform: Platform,
		private splashScreen: SplashScreen,
		private statusBar: StatusBar,
		private navController: NavController,
		private translateService: TranslateService,
		private ionicNetwork: Network,
		private toastProvider: ToastProvider,
		private authProvider: AuthProvider,
		private menuCtrl: MenuController,
		private userDataService: UserDataService,
		private arkApiProvider: ArkApiProvider,
		private settingsDataProvider: SettingsDataProvider,
		public element: ElementRef,
		private renderer: Renderer2,
		private eventBus: EventBusProvider,
		private screenOrientation: ScreenOrientation,
		private actionSheetCtrl: ActionSheetController,
		private modalCtrl: ModalController,
		private router: Router,
		private alertCtrl: AlertController,
		private config: Config,
		private keyboard: Keyboard,
		private loggerService: LoggerService,
	) {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.loggerService.info("App is ready");
			this.initTranslation();
			this.initConfig();
			this.initTheme();
			this.initSessionCheck();
			this.initBackButton();
			this.splashScreen.hide();

			this.authProvider.hasSeenIntro().subscribe((hasSeenIntro) => {
				if (!hasSeenIntro) {
					this.openPage("/intro", true);
					return;
				}

				this.openPage("/login", true);
			});
		});
	}

	initTranslation() {
		this.translateService.setDefaultLang("en");
		this.settingsDataProvider.settings.subscribe((settings) => {
			this.translateService.use(settings.language);

			this.translateService
				.get([
					"BACK_BUTTON_TEXT",
					"EXIT_APP_TEXT",
					"SIGN_OUT_PROFILE_TEXT",
				])
				.subscribe((translations) => {
					// this.config.set('backButtonText', translations['BACK_BUTTON_TEXT']);
					this.exitText = translations.EXIT_APP_TEXT;
					this.signOutText = translations.SIGN_OUT_PROFILE_TEXT;
				});
		});
	}

	async closeOverlays() {
		try {
			const current = await this.alertCtrl.getTop();
			if (current) {
				await current.dismiss();
				return true;
			}
		} catch {}

		try {
			const current = await this.actionSheetCtrl.getTop();
			if (current) {
				await current.dismiss();
				return true;
			}
		} catch {}

		try {
			const current = await this.modalCtrl.getTop();
			if (current) {
				await current.dismiss();
				return true;
			}
		} catch {}

		if (this.menuCtrl && (await this.menuCtrl.isOpen(this.menuId))) {
			await this.menuCtrl.close(this.menuId);
			return true;
		}
	}

	initBackButton() {
		this.platform.backButton.subscribe(async () => {
			const path = this.router.url;

			const hadAnyOpen = await this.closeOverlays();

			if (hadAnyOpen) {
				return;
			}

			// The `modalCtrl.getTop` method does not capture open modals on subpages
			// then it checks if the current route is the same from the next tick
			setTimeout(() => {
				if (path !== this.router.url) {
					return;
				}

				this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
					if (outlet && outlet.canGoBack()) {
						outlet.pop();
					} else {
						if (path === "/login" || path === "/intro") {
							this.showConfirmation(this.exitText).then(() => {
								// tslint:disable-next-line: no-string-literal
								navigator["app"].exitApp();
							});
						} else if (path === "/wallets") {
							this.showConfirmation(this.signOutText).then(() => {
								this.logout();
							});
						} else if (path.startsWith("/wallets/dashboard")) {
							this.navController.navigateRoot("/wallets");
						}
					}
				});
			}, 0);
		});
	}

	initTheme() {
		this.settingsDataProvider.settings.subscribe((settings) => {
			if (settings.darkMode) {
				this.renderer.addClass(
					this.element.nativeElement.parentNode,
					"dark-theme",
				);
				this.keyboard.setKeyboardStyle(KeyboardStyle.Dark);
				this.statusBar.styleBlackTranslucent();
			} else {
				this.renderer.removeClass(
					this.element.nativeElement.parentNode,
					"dark-theme",
				);
				this.keyboard.setKeyboardStyle(KeyboardStyle.Light);

				if (this.platform.is("android")) {
					this.statusBar.styleLightContent();
				} else {
					this.statusBar.styleDefault();
				}
			}
		});
	}

	initSessionCheck() {
		if (this.platform.is("cordova")) {
			this.platform.pause.subscribe(() => {
				this.lastPauseTimestamp = moment().toDate();
			});

			this.platform.resume.subscribe(async () => {
				const now = moment();
				const diff = now.diff(this.lastPauseTimestamp);

				if (diff >= constants.APP_TIMEOUT_DESTROY) {
					await this.closeOverlays();
					this.logout();
				}
			});
		}
	}

	initConfig() {
		if (this.platform.is("cordova")) {
			this.statusBar.styleDefault();

			this.config.set("scrollAssist", false);

			if (this.platform.is("ios")) {
				this.keyboard.setResizeMode(KeyboardResizeMode.None);
				this.config.set("scrollPadding", false);
			}

			if (this.platform.is("android")) {
				this.statusBar.show();
			}

			this.screenOrientation.lock("portrait");
		}

		this.menuCtrl.enable(false, this.menuId);

		this.eventBus.$subject.subscribe((event) => {
			switch (event.key) {
				case "qrScanner:show":
					this.hideRouter = true;
					break;
				case "qrScanner:hide":
					this.hideRouter = false;
					break;
			}
		});
	}

	openPage(path: string, rootPage: boolean = true) {
		this.menuCtrl.close(this.menuId);
		if (rootPage) {
			this.navController.navigateRoot(path);
		} else {
			this.navController.navigateForward(path);
		}
	}

	logout() {
		this.authProvider.logout();
	}

	ngOnInit() {
		this.onUserLogin();
		this.onUserLogout();
		this.verifyNetwork();

		this.onCreateWallet();

		this.settingsDataProvider.onUpdate$.subscribe(() => {
			this.initTranslation();
			this.initTheme();
		});
	}

	ngOnDestroy() {
		this.unsubscriber$.next();
		this.unsubscriber$.complete();
		this.authProvider.logout();
	}

	private showConfirmation(title: string): Promise<void> {
		return new Promise((resolve) => {
			this.translateService
				.get(["NO", "YES"])
				.subscribe(async (translation) => {
					const alert = await this.alertCtrl.create({
						subHeader: title,
						buttons: [
							{
								text: translation.NO,
								role: "cancel",
								handler: () => {},
							},
							{
								text: translation.YES,
								handler: () => resolve(),
							},
						],
					});
					alert.present();
				});
		});
	}

	// Verify if new wallet is a delegate
	private onCreateWallet() {
		return this.userDataService.onCreateWallet$
			.pipe(takeUntil(this.unsubscriber$), debounceTime(500))
			.subscribe((wallet: Wallet) => {
				this.arkApiProvider
					.getDelegateByPublicKey(wallet.publicKey)
					.pipe(
						switchMap((delegate) =>
							this.userDataService.ensureWalletDelegateProperties(
								wallet,
								delegate,
							),
						),
					)
					.subscribe();
			});
	}

	// Redirect user when login or logout
	private onUserLogin(): void {
		this.authProvider.onLogin$
			.pipe(takeUntil(this.unsubscriber$))
			.subscribe(() => {
				this.profile = this.userDataService.currentProfile;
				this.network = this.userDataService.currentNetwork;

				return this.menuCtrl.enable(true, this.menuId);
			});
	}

	private onUserLogout(): void {
		this.authProvider.onLogout$
			.pipe(takeUntil(this.unsubscriber$))
			.subscribe(() => {
				this.userDataService.clearCurrentWallet();

				this.menuCtrl.enable(false, this.menuId);
				return this.openPage("/login");
			});
	}

	private verifyNetwork() {
		this.ionicNetwork
			.onDisconnect()
			.pipe(takeUntil(this.unsubscriber$))
			.subscribe(() =>
				this.toastProvider.error("NETWORKS_PAGE.INTERNET_DESCONNECTED"),
			);
	}
}
