import { PinCodeComponent } from "@/components/pin-code/pin-code";
import { Wallet } from "@/models/model";
import { UserDataProvider } from "@/services/user-data/user-data";
import { Component, ViewChild } from "@angular/core";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import {
	AlertController,
	ModalController,
	NavController,
} from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { CustomNetworkCreateModal } from "../modals/custom-network-create/custom-network-create";
import { PinCodeModal } from "../modals/pin-code/pin-code";
import { SettingsConfig } from "./settings.config";
import { SettingsActions } from "./shared/settings.actions";
import { SETTINGS_STATE_TOKEN } from "./shared/settings.state";
import { SettingsStateModel } from "./shared/settings.type";

const packageJson = require("@@/package.json");

@Component({
	templateUrl: "settings.component.html",
	providers: [InAppBrowser],
})
export class SettingsComponent {
	@Select(SETTINGS_STATE_TOKEN)
	public settings$: Observable<SettingsStateModel>;

	@ViewChild(PinCodeComponent, { static: true })
	pinCode: PinCodeComponent;

	public languages = SettingsConfig.LANGUAGES;
	public currencies = SettingsConfig.CURRENCIES;
	public wordlistLanguages = SettingsConfig.WORDLIST_LANGUAGES;

	public appVersion = packageJson.version;

	public wallet: Wallet;

	constructor(
		private translateService: TranslateService,
		private alertCtrl: AlertController,
		private modalCtrl: ModalController,
		private navCtrl: NavController,
		private inAppBrowser: InAppBrowser,
		// TODO: Use the store instead of the provider
		private userDataProvider: UserDataProvider,
		private store: Store,
	) {
		this.wallet = this.userDataProvider.currentWallet;
	}

	public async openChangePinPage(): Promise<void> {
		const modal = await this.modalCtrl.create({
			component: PinCodeModal,
			componentProps: {
				message: "PIN_CODE.DEFAULT_MESSAGE",
				outputPassword: true,
				validatePassword: true,
			},
		});

		await modal.present();
		modal.onDidDismiss().then(({ data }) => {
			if (data.password) {
				this.pinCode.createUpdatePinCode(null, data.password);
			}
		});
	}

	public async openManageNetworksPage(): Promise<void> {
		const modal = await this.modalCtrl.create({
			component: CustomNetworkCreateModal,
		});

		modal.present();
	}

	public openPrivacyPolicy(): void {
		this.inAppBrowser.create(SettingsConfig.PRIVACY_POLICY_URL, "_system");
	}

	public onEnterPinCode() {
		return this.clear();
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

	public updateDarkMode(value: boolean): void {
		this.update({ darkMode: value });
	}

	public confirmClear() {
		this.translateService
			.get([
				"CANCEL",
				"CONFIRM",
				"ARE_YOU_SURE",
				"SETTINGS_PAGE.CLEAR_DATA_TEXT",
			])
			.subscribe(async translation => {
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
								this.pinCode.open(
									"PIN_CODE.DEFAULT_MESSAGE",
									false,
								);
							},
						},
					],
				});

				confirm.present();
			});
	}

	private clear() {
		this.store.dispatch(new SettingsActions.Clear());
		this.navCtrl.navigateRoot("/intro");
	}

	private update(payload: Partial<SettingsStateModel>): Observable<any> {
		return this.store.dispatch(new SettingsActions.Update(payload));
	}
}
