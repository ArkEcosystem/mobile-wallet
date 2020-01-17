import { CustomNetworkCreateModal } from "@/app/modals/custom-network-create/custom-network-create";
import {
	CustomNetworkEditModal,
	EditNetworkAction,
} from "@/app/modals/custom-network-edit/custom-network-edit";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataProvider } from "@/services/user-data/user-data";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Network } from "ark-ts/model";
import lodash from "lodash";

@Component({
	selector: "customNetwork",
	templateUrl: "custom-network.html",
})
export class CustomNetworkComponent implements OnInit {
	@Output()
	public networkChange: EventEmitter<string> = new EventEmitter();

	@Input()
	public openManageDialogOnSelect: boolean;

	@Input()
	public showSuccessMessages: boolean;

	public networks: { [networkId: string]: Network };
	public networksIds: string[];
	public networkChoices: { name: string; id?: string }[] = [];

	public activeNetworkChoice: { name: string; id?: string };

	public constructor(
		private userDataProvider: UserDataProvider,
		private modalCtrl: ModalController,
		private toastProvider: ToastProvider,
	) {}

	public ngOnInit() {
		this.loadNetworks();
	}

	private loadNetworks(): void {
		this.networks = this.userDataProvider.networks;
		this.networksIds = lodash.keys(this.networks);
		this.networkChoices = this.networksIds
			.filter(id =>
				this.userDataProvider.defaultNetworks.every(
					defaultNetwork =>
						this.networks[id].name !== defaultNetwork.name,
				),
			)
			.map(id => {
				return { name: this.networks[id].name, id };
			});
	}

	public async createNewModal() {
		const modal = await this.modalCtrl.create({
			component: CustomNetworkCreateModal,
		});

		modal.onDidDismiss().then(({ data }) => {
			if (!data) {
				return;
			}
			this.openManageDialog(data);
		});

		modal.present();
	}

	private async openManageDialog(network: Network, networkId?: string) {
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

			if (this.showSuccessMessages) {
				if (data.action === EditNetworkAction.Update) {
					this.toastProvider.success(
						"CUSTOM_NETWORK.SAVE_SUCCESSFUL",
					);
				} else if (data.action === EditNetworkAction.Delete) {
					this.toastProvider.success(
						"CUSTOM_NETWORK.DELETE_SUCCESSFUL",
					);
				}
			}

			this.loadNetworks();

			const filteredNetworks = this.networkChoices.filter(
				n => n.id === data.networkId,
			);
			if (filteredNetworks.length) {
				this.activeNetworkChoice = filteredNetworks[0];
			} else {
				this.activeNetworkChoice = null;
			}
			this.emitActiveNetwork();
		});
		modal.present();
	}

	public onActiveNetworkChange(): void {
		if (this.openManageDialogOnSelect) {
			this.openManageDialog(
				this.networks[this.activeNetworkChoice.id],
				this.activeNetworkChoice.id,
			);
		} else {
			this.emitActiveNetwork();
		}
	}

	private emitActiveNetwork() {
		this.networkChange.next(
			this.activeNetworkChoice ? this.activeNetworkChoice.id : null,
		);
	}
}
