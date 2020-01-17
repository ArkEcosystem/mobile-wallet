import { Component } from "@angular/core";
import {
	AlertController,
	ModalController,
	NavController,
	NavParams,
} from "@ionic/angular";

import { ArkApiProvider } from "@/services/ark-api/ark-api";
import { UserDataProvider } from "@/services/user-data/user-data";
import { Delegate, Network, TransactionType } from "ark-ts";

import { Wallet } from "@/models/wallet";

import { ToastProvider } from "@/services/toast/toast";
import { Clipboard } from "@ionic-native/clipboard/ngx";
import { TranslateService } from "@ngx-translate/core";
import lodash from "lodash";

@Component({
	selector: "page-delegate-detail",
	templateUrl: "delegate-detail.html",
	styleUrls: ["delegate-detail.pcss"],
	providers: [Clipboard],
})
export class DelegateDetailPage {
	public delegate: Delegate;
	public qraddress = '{a: ""}';
	public currentNetwork: Network;
	public currentWallet: Wallet;
	public walletVote: Delegate;
	public transactionType = TransactionType.Vote;
	public fee: number;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private arkApiProvider: ArkApiProvider,
		private modalCtrl: ModalController,
		private clipboard: Clipboard,
		private userDataProvider: UserDataProvider,
		private alertCtrl: AlertController,
		private translateService: TranslateService,
		private toastProvider: ToastProvider,
	) {
		this.delegate = this.navParams.get("delegate");
		this.walletVote = this.navParams.get("vote");

		this.qraddress = `'{a: "${this.delegate.address}"}'`;
		this.currentNetwork = this.arkApiProvider.network;
		this.currentWallet = this.userDataProvider.currentWallet;

		if (!this.delegate) {
			this.navCtrl.pop();
		}
	}

	isSameDelegate() {
		if (
			this.currentWallet &&
			this.walletVote &&
			this.delegate.publicKey === this.walletVote.publicKey
		) {
			return true;
		}

		return false;
	}

	isWalletSelected() {
		return (
			!lodash.isNil(this.currentWallet) && !this.currentWallet.isWatchOnly
		);
	}

	copyAddress() {
		this.clipboard.copy(this.delegate.address).then(
			() => this.toastProvider.success("COPIED_CLIPBOARD"),
			() => this.toastProvider.error("COPY_CLIPBOARD_FAILED"),
		);
	}

	submit() {
		if (!this.currentWallet) {
			return false;
		}

		if (
			this.walletVote &&
			this.walletVote.publicKey !== this.delegate.publicKey
		) {
			this.translateService
				.get(
					[
						"DELEGATES_PAGE.UNVOTE_CURRENT_DELEGATE",
						"CANCEL",
						"DELEGATES_PAGE.UNVOTE",
					],
					{ delegate: this.walletVote.username },
				)
				.subscribe(async translation => {
					const alert = await this.alertCtrl.create({
						header: translation["DELEGATES_PAGE.UNVOTE"],
						message:
							translation[
								"DELEGATES_PAGE.UNVOTE_CURRENT_DELEGATE"
							],
						buttons: [
							{
								text: translation.CANCEL,
							},
							{
								text: translation["DELEGATES_PAGE.UNVOTE"],
								handler: () => {
									this.unvote();
								},
							},
						],
					});

					alert.present();
				});
		} else {
			this.dismiss(this.delegate);
		}
	}

	onInputFee(fee) {
		this.fee = fee;
	}

	unvote() {
		this.dismiss(this.walletVote);
	}

	dismiss(delegate?: Delegate) {
		this.modalCtrl.dismiss({ delegateVote: delegate, fee: this.fee });
	}
}
