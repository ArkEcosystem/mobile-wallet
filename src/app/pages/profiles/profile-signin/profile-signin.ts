import { Component, OnDestroy, ViewChild } from "@angular/core";
import {
	ActionSheetController,
	AlertController,
	NavController,
} from "@ionic/angular";
import { Platform } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { PublicKey } from "ark-ts/core";
import { NetworkType } from "ark-ts/model";
import lodash from "lodash";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { PinCodeComponent } from "@/components/pin-code/pin-code";
import { AddressMap } from "@/models/model";
import { AuthProvider } from "@/services/auth/auth";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataService } from "@/services/user-data/user-data.interface";

@Component({
	selector: "page-profile-signin",
	templateUrl: "profile-signin.html",
	styleUrls: ["profile-signin.scss"],
})
export class ProfileSigninPage implements OnDestroy {
	@ViewChild("pinCode", { read: PinCodeComponent, static: true })
	pinCode: PinCodeComponent;

	public profiles;
	public addresses: AddressMap[];
	public networks;

	private profileIdSelected: string;
	private unsubscriber$: Subject<void> = new Subject<void>();

	constructor(
		public platform: Platform,
		public navCtrl: NavController,
		private userDataService: UserDataService,
		private translateService: TranslateService,
		private authProvider: AuthProvider,
		private toastProvider: ToastProvider,
		private alertCtrl: AlertController,
		private actionSheetCtrl: ActionSheetController,
	) {}

	presentProfileActionSheet(profileId: string) {
		this.translateService
			.get(["EDIT", "DELETE"])
			.subscribe(async (translation) => {
				const buttons = [
					{
						text: translation.DELETE,
						role: "delete",
						icon: "trash",
						handler: () => {
							if (!this.profileHasWallets(profileId)) {
								this.showDeleteConfirm(profileId);
							} else {
								this.toastProvider.error(
									"PROFILES_PAGE.DELETE_NOT_EMPTY",
								);
							}
						},
					},
				];

				const action = await this.actionSheetCtrl.create({ buttons });
				action.present();
			});
	}

	openProfileCreate() {
		this.navCtrl.navigateForward("/profile/create");
	}

	showDeleteConfirm(profileId: string) {
		this.translateService
			.get(["ARE_YOU_SURE", "CONFIRM", "CANCEL"])
			.subscribe(async (translation) => {
				const confirm = await this.alertCtrl.create({
					header: translation.ARE_YOU_SURE,
					buttons: [
						{
							text: translation.CANCEL,
						},
						{
							text: translation.CONFIRM,
							handler: () => {
								this.delete(profileId);
							},
						},
					],
				});
				confirm.present();
			});
	}

	delete(profileId: string) {
		return this.userDataService
			.removeProfileById(profileId)
			.pipe(takeUntil(this.unsubscriber$))
			.subscribe(() => {
				this.load();
			});
	}

	verify(profileId: string) {
		this.profileIdSelected = profileId;
		this.pinCode.open("PIN_CODE.DEFAULT_MESSAGE", false);
	}

	signin() {
		if (!this.profileIdSelected) {
			return;
		}

		this.authProvider
			.login(this.profileIdSelected)
			.pipe(takeUntil(this.unsubscriber$))
			.subscribe((status) => {
				if (status) {
					this.navCtrl.navigateRoot("/wallets");
				} else {
					this.error();
				}
			});
	}

	error() {
		this.toastProvider.error("PIN_CODE.SIGN_IN_ERROR");
	}

	load() {
		this.profiles = this.userDataService.profiles;
		this.networks = this.userDataService.networks;

		this.addresses = lodash(this.profiles)
			.mapValues((o) => [o.name, o.networkId])
			.transform((result, data, id) => {
				const network = this.networks[data[1]];
				if (!network) {
					return;
				}
				const networkName = lodash.capitalize(network.name);
				const isMainnet = network.type === NetworkType.Mainnet;

				result.push({
					index: id,
					key: data[0],
					value: networkName,
					highlight: isMainnet,
					hasMore: true,
				});
			}, [])
			.value();
	}

	isEmpty() {
		return lodash.isEmpty(this.profiles);
	}

	ionViewWillEnter() {
		this.load();
	}

	ngOnDestroy() {
		this.unsubscriber$.next();
		this.unsubscriber$.complete();
	}

	private profileHasWallets(profileId: string): boolean {
		const profile = this.profiles[profileId];
		const network = this.networks[profile.networkId];
		for (const wallet of lodash.values(profile.wallets)) {
			if (PublicKey.validateAddress(wallet.address, network)) {
				return true;
			}
		}

		return false;
	}
}
