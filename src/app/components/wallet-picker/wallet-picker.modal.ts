import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

import { Contact, Wallet } from "@/models/model";
import { ArkApiProvider } from "@/services/ark-api/ark-api";
import { UserDataProvider } from "@/services/user-data/user-data";

@Component({
	templateUrl: "wallet-picker.modal.html",
})
export class WalletPickerModal implements OnInit {
	public contacts = [];
	public wallets = [];
	public symbol: string;

	constructor(
		private modalCtrl: ModalController,
		private userDataProvider: UserDataProvider,
		private arkApiProvider: ArkApiProvider,
	) {}

	ngOnInit() {
		const profile = this.userDataProvider.currentProfile;
		const network = this.userDataProvider.currentNetwork;
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
