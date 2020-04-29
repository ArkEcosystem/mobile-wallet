import { Component } from "@angular/core";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import {
	AlertController,
	ModalController,
	NavController,
	Platform,
} from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";

import { AuthController } from "@/app/auth/shared/auth.controller";
import { ViewerLogModal } from "@/components/viewer-log/viewer-log.modal";
import { SettingsDataProvider } from "@/services/settings-data/settings-data";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataService } from "@/services/user-data/user-data.interface";

import { SettingsActions } from "./shared/settings.actions";
import { SettingsConfig } from "./shared/settings.config";
import { SETTINGS_STATE_TOKEN } from "./shared/settings.state";
import { SettingsState } from "./shared/settings.state";
import { SettingsStateModel } from "./shared/settings.type";

const packageJson = require("@@/package.json");

@Component({
	selector: "settings-page",
	templateUrl: "settings.component.html",
	styleUrls: ["settings.scss"],
	providers: [InAppBrowser],
})
export class SettingsPage {
	@Select(SETTINGS_STATE_TOKEN)
	public settings$: Observable<SettingsStateModel>;

	@Select(SettingsState.devMode)
	public devMode$: Observable<boolean>;

	public appVersion: number = packageJson.version;
	public versionClicksCount = 0;
	public languages = SettingsConfig.LANGUAGES;
	public currencies = SettingsConfig.CURRENCIES;
	public wordlistLanguages = SettingsConfig.WORDLIST_LANGUAGES;
	public currentWallet;

	constructor(
		public platform: Platform,
		private navCtrl: NavController,
		private settingsDataProvider: SettingsDataProvider,
		private alertCtrl: AlertController,
		private translateService: TranslateService,
		private modalCtrl: ModalController,
		private inAppBrowser: InAppBrowser,
		private userDataService: UserDataService,
		private toastProvider: ToastProvider,
		private authCtrl: AuthController,
		private store: Store,
	) {
		this.currentWallet = this.userDataService.currentWallet;
	}

	openChangePinPage() {
		this.authCtrl.update();
	}

	openManageNetworksPage() {
		this.navCtrl.navigateForward("/network-overview");
	}

	openPrivacyPolicy() {
		this.inAppBrowser.create(SettingsConfig.PRIVACY_POLICY_URL, "_system");
	}

	confirmClearData() {
		this.translateService
			.get([
				"CANCEL",
				"CONFIRM",
				"ARE_YOU_SURE",
				"SETTINGS_PAGE.CLEAR_DATA_TEXT",
			])
			.subscribe(async (translation) => {
				const confirm = await this.alertCtrl.create({
					header: translation.ARE_YOU_SURE,
					message: translation["SETTINGS_PAGE.CLEAR_DATA_TEXT"],
					buttons: [
						{
							text: translation.CANCEL,
						},
						{
							text: translation.CONFIRM,
							handler: () => {
								this.authCtrl.request();
								this.clearData();
							},
						},
					],
				});

				confirm.present();
			});
	}

	async presentLogReport() {
		const viewerLogModal = await this.modalCtrl.create({
			component: ViewerLogModal,
		});

		await viewerLogModal.present();
	}

	handleVersionClicks() {
		this.devMode$.subscribe((devMode) => {
			if (devMode) {
				return;
			}

			this.versionClicksCount += 1;
			if (this.versionClicksCount === 5) {
				this.enableDevMode();
			}
		});
	}

	enableDevMode() {
		this.versionClicksCount = 0;
		this.updateDevMode(true);
		this.toastProvider.show("SETTINGS_PAGE.YOU_ARE_DEVELOPER");
	}

	public updateLanguage(event: CustomEvent): void {
		this.update({ language: event.detail.value });
	}

	public updateCurrency(event: CustomEvent): void {
		this.update({ currency: event.detail.value });
	}

	public updateWordlistLanguage(event: CustomEvent): void {
		this.update({ wordlistLanguage: event.detail.value });
	}

	public updateDarkMode(event: CustomEvent): void {
		this.update({ darkMode: event.detail.checked });
	}

	public updateDevMode(value: boolean): void {
		this.update({ devMode: value });
	}

	private update(payload: Partial<SettingsStateModel>): Observable<any> {
		return this.store.dispatch(new SettingsActions.Update(payload));
	}

	private clearData() {
		this.store.dispatch(new SettingsActions.Clear());
		this.navCtrl.navigateRoot("/onboarding");
	}
}
