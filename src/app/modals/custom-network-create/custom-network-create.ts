import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { LoadingController, ModalController } from "@ionic/angular";
import { Network, Peer } from "ark-ts";
import lodash from "lodash";
import { finalize } from "rxjs/operators";

import { ToastProvider } from "@/services/toast/toast";
import ArkClient from "@/utils/ark-client";

@Component({
	selector: "customNetworkCreate",
	templateUrl: "custom-network-create.html",
	styleUrls: ["custom-network-create.pcss"],
})
export class CustomNetworkCreateModal {
	public network: Network = new Network();
	public name: string;
	public seedServer: string;

	public constructor(
		private modalCtrl: ModalController,
		private toastProvider: ToastProvider,
		private loadingCtrl: LoadingController,
		private httpClient: HttpClient,
	) {}

	public dismiss(network?: Network): void {
		this.modalCtrl.dismiss(network);
	}

	public async configure(): Promise<void> {
		const loading = await this.loadingCtrl.create();
		loading.present();

		const seedServerUrl = this.getSeedServerUrl();

		new ArkClient(this.seedServer, this.httpClient)
			.getNodeConfiguration()
			.pipe(finalize(() => loading.dismiss()))
			.subscribe(
				(response) => {
					this.network.name = this.name;
					this.network.nethash = response.nethash;
					this.network.token = response.token;
					this.network.symbol = response.symbol;
					this.network.explorer = response.explorer;
					this.network.version = response.version;
					this.network.type = null;

					const apiConfig: any = lodash.find(
						response.ports,
						(_, key) => key.split("/").reverse()[0] === "core-api",
					);
					if (!response.ports || !apiConfig) {
						this.configureError();
						return;
					}
					this.network.apiPort = apiConfig;

					this.network.activePeer = new Peer();
					this.network.activePeer.ip = seedServerUrl.hostname;
					this.network.activePeer.port = apiConfig;

					this.network.isV2 = true;
					this.dismiss(this.network);
				},
				() => this.configureError(),
			);
	}

	public getSeedServerUrl(): URL {
		try {
			return new URL(this.seedServer);
		} catch (error) {
			return null;
		}
	}

	private configureError(): void {
		this.network = new Network();
		this.toastProvider.error("CUSTOM_NETWORK.CONFIGURE_ERROR");
	}
}
