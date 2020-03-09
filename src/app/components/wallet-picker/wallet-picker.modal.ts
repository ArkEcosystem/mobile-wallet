import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

import { Contact, Wallet } from "@/models/model";
import { ArkApiProvider } from "@/services/ark-api/ark-api";
import { UserDataService } from "@/services/user-data/user-data.interface";

@Component({
	templateUrl: "wallet-picker.modal.html",
})
export class WalletPickerModal implements OnInit {
	public contacts = [];
	public wallets = [];
	public symbol: string;

	constructor(
		private modalCtrl: ModalController,
		private userDataService: UserDataService,
		private arkApiProvider: ArkApiProvider,
	) {}

	ngOnInit() {
		const profile = this.userDataService.currentProfile;
		const network = this.userDataService.currentNetwork;
		this.symbol = network.symbol;
		this.contacts = Object.values(profile.contacts);
		this.wallets = Object.values(profile.wallets)
			// ensure only valid addresses in the current network
			.filter((wallet: Wallet) =>
				this.arkApiProvider.validateAddress(wallet.address),
			)
			.map((wallet: Wallet) => ({
				name: wallet.label,
				address: wallet.address,
			}));
	}

	onPick(wallet: Contact) {
		this.modalCtrl.dismiss(wallet);
	}
}
