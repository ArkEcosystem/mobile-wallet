import { Component, OnDestroy, ViewChild } from "@angular/core";
import { AlertController, NavController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Network } from "ark-ts/model";
import lodash from "lodash";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { Profile } from "@/models/profile";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataService } from "@/services/user-data/user-data.interface";

@Component({
	selector: "page-profile-create",
	templateUrl: "profile-create.html",
	styleUrls: ["profile-create.scss"],
})
export class ProfileCreatePage implements OnDestroy {
	@ViewChild("createProfileForm", { static: true })
	createProfileForm: HTMLFormElement;

	public networks: { [networkId: string]: Network };
	public networksIds: string[];
	public networkChoices: { name: string; id?: string }[] = [];

	public activeNetworkChoice: { name: string; id?: string };

	public newProfile = { name: "", networkId: "" };
	public showAdvancedOptions = false;

	private unsubscriber$: Subject<void> = new Subject<void>();

	constructor(
		public navCtrl: NavController,
		private alertCtrl: AlertController,
		private userDataService: UserDataService,
		private toastProvider: ToastProvider,
		private translateService: TranslateService,
	) {}

	onSelectNetwork(event: any) {
		const detail = event.detail.value;
		this.activeNetworkChoice = this.networkChoices.find(
			(item) => item.id === detail,
		);
		this.newProfile.networkId = this.activeNetworkChoice.id;
	}

	submitForm() {
		const existingProfile = this.userDataService.getProfileByName(
			this.newProfile.name,
		);

		if (existingProfile) {
			this.showAlert("PROFILES_PAGE.PROFILENAME_ALREADY_EXISTS", {
				name: this.newProfile.name,
			});
			this.createProfileForm.form.controls.name.setErrors({
				incorrect: !!existingProfile,
			});
		} else {
			const profile = new Profile();
			profile.name = this.newProfile.name;
			profile.networkId = this.newProfile.networkId;

			this.userDataService
				.addProfile(profile)
				.pipe(takeUntil(this.unsubscriber$))
				.subscribe(
					() => {
						this.navCtrl.navigateRoot("/profile/signin");
					},
					() => {
						this.toastProvider.error(
							"PROFILES_PAGE.ADD_PROFILE_ERROR",
						);
					},
				);
		}
	}

	load() {
		this.translateService
			.get("PROFILES_PAGE.CUSTOM")
			.subscribe((customTrans) => {
				this.networks = this.userDataService.networks;
				this.networksIds = lodash.keys(this.networks);
				this.networkChoices = this.networksIds
					.filter((id) =>
						this.userDataService.defaultNetworks.some(
							(defaultNetwork) =>
								this.networks[id].name === defaultNetwork.name,
						),
					)
					.map((id) => {
						return { name: this.networks[id].name, id };
					});
				this.networkChoices.push({ name: customTrans, id: null });
				this.newProfile.networkId = this.networksIds[0];
				this.activeNetworkChoice = this.networkChoices[0];
			});
	}

	toggleAdvanced() {
		this.showAdvancedOptions = !this.showAdvancedOptions;
	}

	public onCustomNetworkChange(customNetworkId: string) {
		if (customNetworkId) {
			this.newProfile.networkId = customNetworkId;
		} else {
			this.load();
		}
	}

	ionViewWillEnter() {
		this.load();
	}

	ngOnDestroy() {
		this.unsubscriber$.next();
		this.unsubscriber$.complete();
	}

	private showAlert(titleKey: string, stringParams: any) {
		this.translateService
			.get([titleKey, "BACK_BUTTON_TEXT"], stringParams)
			.subscribe(async (translation) => {
				const alert = await this.alertCtrl.create({
					subHeader: translation[titleKey],
					buttons: [translation.BACK_BUTTON_TEXT],
				});
				alert.present();
			});
	}
}
