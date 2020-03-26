import { Component } from "@angular/core";
import { AlertController, ModalController, NavParams } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import lodash from "lodash";

import { StoredNetwork } from "@/models/stored-network";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataService } from "@/services/user-data/user-data.interface";

export enum EditNetworkAction {
	Update,
	Delete,
}
export interface EditNetworkResult {
	networkId: string;
	action: EditNetworkAction;
}

@Component({
	selector: "customNetworkEdit",
	templateUrl: "custom-network-edit.html",
})
export class CustomNetworkEditModal {
	public network: StoredNetwork;
	public apiPort: number;
	public p2pPort: number;
	public networkId: string;
	public isDefault: boolean;

	public constructor(
		public navParams: NavParams,
		private modalCtrl: ModalController,
		private alertCtrl: AlertController,
		private userDataService: UserDataService,
		private translateService: TranslateService,
		private toastProvider: ToastProvider,
	) {
		const defaultNetworksNames = this.userDataService.defaultNetworks.map(
			(item) => item.name,
		);
		this.network = this.navParams.get("network") || new StoredNetwork();
		this.networkId = this.navParams.get("id");

		this.isDefault = defaultNetworksNames.includes(this.network.name);
		this.apiPort = this.network.isV2
			? this.network.apiPort
			: this.network.activePeer.port;
		this.p2pPort = this.network.isV2
			? this.network.p2pPort
			: this.network.activePeer.port;
	}

	dismiss(result?: EditNetworkResult) {
		this.modalCtrl.dismiss(result);
	}

	public updateApiPort() {
		this.network.apiPort = this.apiPort;
	}

	public updateP2PPort() {
		if (this.network.isV2) {
			this.network.p2pPort = this.p2pPort;
		}
		this.network.activePeer.port = this.p2pPort;
	}

	public save(): void {
		this.userDataService
			.addOrUpdateNetwork(this.network, this.networkId)
			.subscribe((network) =>
				this.dismiss({
					action: EditNetworkAction.Update,
					networkId: network.id,
				}),
			);
	}

	public prepareDelete(): void {
		if (
			lodash.some(
				this.userDataService.profiles,
				(p: any) => p.networkId === this.networkId,
			)
		) {
			this.toastProvider.error("CUSTOM_NETWORK.DELETE_FAIL_NOT_EMPTY");
			return;
		}

		this.translateService
			.get(["CUSTOM_NETWORK.CONFIRM_DELETE", "NO", "YES"])
			.subscribe(async (translations) => {
				const alert = await this.alertCtrl.create({
					header: translations["CUSTOM_NETWORK.CONFIRM_DELETE"],
					buttons: [
						{
							text: translations.NO,
							role: "cancel",
							handler: () => {},
						},
						{
							text: translations.YES,
							handler: () => this.delete(),
						},
					],
				});

				alert.present();
			});
	}

	private delete(): void {
		this.userDataService.removeNetworkById(this.networkId).subscribe(() =>
			this.dismiss({
				action: EditNetworkAction.Delete,
				networkId: this.networkId,
			}),
		);
	}
}
