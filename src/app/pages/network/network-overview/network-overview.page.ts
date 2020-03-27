import { Component } from "@angular/core";
import { ActionSheetController, ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { NetworkType } from "ark-ts";
import lodash from "lodash";

import { CustomNetworkCreateModal } from "@/app/modals/custom-network-create/custom-network-create";
import {
	CustomNetworkEditModal,
	EditNetworkAction,
} from "@/app/modals/custom-network-edit/custom-network-edit";
import { AddressMap, StoredNetwork } from "@/models/model";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataService } from "@/services/user-data/user-data.interface";

@Component({
	templateUrl: "network-overview.page.html",
})
export class NetworkOverviewPage {
	public networks: Record<string, StoredNetwork>;
	public networksMap: AddressMap[];

	constructor(
		private translateService: TranslateService,
		private actionSheetCtrl: ActionSheetController,
		private toastProvider: ToastProvider,
		private userDataService: UserDataService,
		private modalCtrl: ModalController,
	) {}

	presentActionSheet(networkId: string) {
		this.translateService.get(["EDIT"]).subscribe(async (translation) => {
			const buttons = [
				{
					text: translation.EDIT,
					role: "edit",
					icon: "edit",
					handler: () => {
						this.editNetwork(networkId);
					},
				},
			];

			const action = await this.actionSheetCtrl.create({ buttons });
			action.present();
		});
	}

	public editNetwork(networkId: string) {
		const network = this.networks[networkId];
		this.openEditNetworkDialog(networkId, network);
	}

	load() {
		this.networks = this.userDataService.networks;
		const defaultNetworks = this.userDataService.defaultNetworks.map(
			(item) => item.name,
		);

		const result = Object.entries(this.networks).map(([id, network]) => {
			const networkName = lodash.capitalize(network.name);
			const isMainnet = network.type === NetworkType.Mainnet;
			const isDefault = defaultNetworks.includes(network.name);

			return {
				index: id,
				key: networkName,
				value: network.token,
				highlight: isMainnet,
				hasMore: !isDefault,
			};
		});

		this.networksMap = result;
	}

	public async openCreateNetworkDialog() {
		const modal = await this.modalCtrl.create({
			component: CustomNetworkCreateModal,
		});

		modal.onDidDismiss().then(({ data }) => {
			if (!data) {
				return;
			}
			this.openEditNetworkDialog(undefined, data);
		});

		modal.present();
	}

	isEmpty() {
		return lodash.isEmpty(this.networksMap);
	}

	ionViewWillEnter() {
		this.load();
	}

	private async openEditNetworkDialog(
		networkId: string,
		network: StoredNetwork,
	) {
		const modal = await this.modalCtrl.create({
			component: CustomNetworkEditModal,
			componentProps: {
				network,
				id: networkId,
			},
		});

		modal.onDidDismiss().then(({ data }) => {
			if (!data) {
				return;
			}

			if (data.action === EditNetworkAction.Update) {
				this.toastProvider.success("CUSTOM_NETWORK.SAVE_SUCCESSFUL");
			} else if (data.action === EditNetworkAction.Delete) {
				this.toastProvider.success("CUSTOM_NETWORK.DELETE_SUCCESSFUL");
			}

			this.load();
		});

		modal.present();
	}
}
