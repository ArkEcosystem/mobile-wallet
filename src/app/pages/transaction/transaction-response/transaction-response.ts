import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Clipboard } from "@ionic-native/clipboard/ngx";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { ModalController, NavController } from "@ionic/angular";

import { StoredNetwork, Transaction, Wallet } from "@/models/model";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataService } from "@/services/user-data/user-data.interface";

@Component({
	selector: "page-transaction-response",
	templateUrl: "transaction-response.html",
	styleUrls: ["transaction-response.scss"],
	providers: [Clipboard, InAppBrowser],
})
export class TransactionResponsePage {
	public transaction: Transaction;
	public wallet: Wallet;
	// public keys: WalletKeys = {};
	public response: any = { status: false, message: "" };

	// public showKeepSecondPassphrase = true;
	public currentNetwork: StoredNetwork;

	constructor(
		public navCtrl: NavController,
		private clipboard: Clipboard,
		private modalCtrl: ModalController,
		private userDataService: UserDataService,
		private toastProvider: ToastProvider,
		private iab: InAppBrowser,
		private route: ActivatedRoute,
	) {
		this.wallet = this.userDataService.currentWallet;
		this.currentNetwork = this.userDataService.currentNetwork;

		this.response = this.route.snapshot.queryParamMap.get("response");
		const transaction = this.route.snapshot.queryParamMap.get(
			"transaction",
		);

		if (!this.response) {
			this.navCtrl.pop();
		}

		if (transaction) {
			this.transaction = new Transaction(this.wallet.address).deserialize(
				transaction,
			);
		}
	}

	copyTxid() {
		this.clipboard.copy(this.transaction.id).then(
			() => this.toastProvider.success("COPIED_CLIPBOARD"),
			() => this.toastProvider.error("COPY_CLIPBOARD_FAILED"),
		);
	}

	openInExplorer() {
		const url = `${this.currentNetwork.explorer}/transaction/${this.transaction.id}`;
		return this.iab.create(url, "_system");
	}

	presentEncryptedAlert() {
		this.toastProvider.success(
			"WALLETS_PAGE.ALERT_SUCCESSFULLY_ENCRYPTED_SECOND_PASSPHRASE",
		);
	}

	dismiss() {
		if (this.response && this.response.status) {
			this.navCtrl.navigateRoot("/wallets/dashboard");
		} else {
			this.modalCtrl.dismiss();
		}
	}
}
