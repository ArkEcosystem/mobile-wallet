import { Contact, Wallet } from "@/models/model";
import { UserDataProvider } from "@/services/user-data/user-data";
import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

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
	) {}

	ngOnInit() {
		const profile = this.userDataProvider.currentProfile;
		const network = this.userDataProvider.currentNetwork;
		this.symbol = network.symbol;
		this.contacts = Object.values(profile.contacts);
		this.wallets = Object.values(profile.wallets).map((wallet: Wallet) => ({
			name: wallet.label,
			address: wallet.address,
		}));
	}

	onPick(wallet: Contact) {
		this.modalCtrl.dismiss(wallet);
	}
}
