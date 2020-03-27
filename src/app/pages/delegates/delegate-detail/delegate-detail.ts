import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Clipboard } from "@ionic-native/clipboard/ngx";
import {
	AlertController,
	ModalController,
	NavController,
	NavParams,
} from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Delegate, Network, TransactionType } from "ark-ts";
import lodash from "lodash";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { InputCurrencyOutput } from "@/components/input-currency/input-currency.component";
import { Wallet } from "@/models/wallet";
import { ArkApiProvider } from "@/services/ark-api/ark-api";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataService } from "@/services/user-data/user-data.interface";

@Component({
	selector: "page-delegate-detail",
	templateUrl: "delegate-detail.html",
	styleUrls: ["delegate-detail.pcss"],
	providers: [Clipboard],
})
export class DelegateDetailPage implements OnInit, OnDestroy {
	public delegate: Delegate;
	public qraddress = '{a: ""}';
	public currentNetwork: Network;
	public currentWallet: Wallet;
	public walletVote: Delegate;
	public transactionType = TransactionType.Vote;
	public fee: number;
	public voteForm = new FormGroup({});
	public nodeFees: any;

	private unsubscriber$: Subject<void> = new Subject<void>();

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private arkApiProvider: ArkApiProvider,
		private modalCtrl: ModalController,
		private clipboard: Clipboard,
		private userDataService: UserDataService,
		private alertCtrl: AlertController,
		private translateService: TranslateService,
		private toastProvider: ToastProvider,
	) {
		this.delegate = this.navParams.get("delegate");
		this.walletVote = this.navParams.get("vote");

		this.qraddress = `'{a: "${this.delegate.address}"}'`;
		this.currentNetwork = this.arkApiProvider.network;
		this.currentWallet = this.userDataService.currentWallet;

		if (!this.delegate) {
			this.navCtrl.pop();
		}
	}

	ngOnInit() {
		this.arkApiProvider
			.prepareFeesByType(TransactionType.Vote)
			.pipe(takeUntil(this.unsubscriber$))
			.subscribe((data) => {
				this.nodeFees = data;
			});
	}

	ngOnDestroy() {
		this.unsubscriber$.next();
		this.unsubscriber$.complete();
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
				.subscribe(async (translation) => {
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

	onInputFee(output: InputCurrencyOutput) {
		this.fee = output.satoshi.toNumber();
	}

	unvote() {
		this.dismiss(this.walletVote);
	}

	dismiss(delegate?: Delegate) {
		this.modalCtrl.dismiss({ delegateVote: delegate, fee: this.fee });
	}
}
