import {
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	QueryList,
	Renderer2,
	ViewChildren,
} from "@angular/core";

import { Wallet } from "@/models/model";
import { AuthProvider } from "@/services/auth/auth";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataProvider } from "@/services/user-data/user-data";
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
import { Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";
import { ArkApiProvider } from "./services/ark-api/ark-api";
import { EventBusProvider } from "./services/event-bus/event-bus";
import { SettingsDataProvider } from "./services/settings-data/settings-data";

import * as constants from "@/app/app.constants";
import { Router } from "@angular/router";
import {
	Keyboard,
	KeyboardStyle,
} from "@ionic-native/keyboard/ngx";
import moment from "moment";

@Component({
	selector: "app-root",
	templateUrl: "app.component.html",
	styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnDestroy, OnInit {
	@ViewChildren(IonRouterOutlet)
	routerOutlets: QueryList<IonRouterOutlet>;

	private unsubscriber$: Subject<void> = new Subject<void>();
	private lastPauseTimestamp: Date;

	public profile = null;
	public network = null;

	public exitText: string;
	public signOutText: string;
	public hideRouter = false;

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
		private userDataProvider: UserDataProvider,
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
	) {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.initTranslation();
			this.initConfig();
			this.initTheme();
			this.initSessionCheck();
			this.initBackButton();
			this.splashScreen.hide();

			this.authProvider.hasSeenIntro().subscribe(hasSeenIntro => {
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
		this.settingsDataProvider.settings.subscribe(settings => {
			this.translateService.use(settings.language);

			this.translateService
				.get([
					"BACK_BUTTON_TEXT",
					"EXIT_APP_TEXT",
					"SIGN_OUT_PROFILE_TEXT",
				])
				.subscribe(translations => {
					// this.config.set('backButtonText', translations['BACK_BUTTON_TEXT']);
					this.exitText = translations.EXIT_APP_TEXT;
					this.signOutText = translations.SIGN_OUT_PROFILE_TEXT;
				});
		});
	}

	async closeOverlays() {
		try {
			const current = await this.actionSheetCtrl.getTop();
			if (current) {
				current.dismiss();
				return;
			}
		} catch {}

		try {
			const current = await this.modalCtrl.getTop();
			if (current) {
				current.dismiss();
				return;
			}
		} catch {}

		if (this.menuCtrl && this.menuCtrl.isOpen()) {
			this.menuCtrl.close();
		}
	}

	initBackButton() {
		this.platform.backButton.subscribe(async () => {
			const path = this.router.url;
			await this.closeOverlays();

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
					}
				}
			});
		});
	}

	private showConfirmation(title: string): Promise<void> {
		return new Promise(resolve => {
			this.translateService
				.get(["NO", "YES"])
				.subscribe(async translation => {
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

	initTheme() {
		this.settingsDataProvider.settings.subscribe(settings => {
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
				this.config.set("scrollPadding", false);
			}

			if (this.platform.is("android")) {
				this.statusBar.show();
			}

			this.screenOrientation.lock("portrait");
		}

		this.menuCtrl.enable(false, "sidebar");

		this.eventBus.$subject.subscribe(event => {
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
		this.menuCtrl.close();
		if (rootPage) {
			this.navController.navigateRoot(path);
		} else {
			this.navController.navigateForward(path);
		}
	}

	logout() {
		this.authProvider.logout();
	}

	// Verify if new wallet is a delegate
	private onCreateWallet() {
		return this.userDataProvider.onCreateWallet$
			.pipe(takeUntil(this.unsubscriber$), debounceTime(500))
			.subscribe((wallet: Wallet) => {
				this.arkApiProvider
					.getDelegateByPublicKey(wallet.publicKey)
					.subscribe(delegate =>
						this.userDataProvider.ensureWalletDelegateProperties(
							wallet,
							delegate,
						),
					);
			});
	}

	// Redirect user when login or logout
	private onUserLogin(): void {
		this.authProvider.onLogin$
			.pipe(takeUntil(this.unsubscriber$))
			.subscribe(() => {
				this.profile = this.userDataProvider.currentProfile;
				this.network = this.userDataProvider.currentNetwork;

				return this.menuCtrl.enable(true, "sidebar");
			});
	}

	private onUserLogout(): void {
		this.authProvider.onLogout$
			.pipe(takeUntil(this.unsubscriber$))
			.subscribe(() => {
				this.userDataProvider.clearCurrentWallet();

				this.menuCtrl.enable(false, "sidebar");
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
}
