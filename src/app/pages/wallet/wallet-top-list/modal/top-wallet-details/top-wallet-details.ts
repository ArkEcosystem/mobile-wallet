import * as constants from "@/app/app.constants";
import { MarketCurrency, MarketHistory, MarketTicker } from "@/models/market";
import { Transaction } from "@/models/transaction";
import { Wallet } from "@/models/wallet";
import { ArkApiProvider } from "@/services/ark-api/ark-api";
import { MarketDataProvider } from "@/services/market-data/market-data";
import { SettingsDataProvider } from "@/services/settings-data/settings-data";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataProvider } from "@/services/user-data/user-data";
import { Component, NgZone, OnDestroy } from "@angular/core";
import { Clipboard } from "@ionic-native/clipboard/ngx";
import {
	IonRefresher,
	LoadingController,
	ModalController,
	NavController,
	NavParams,
} from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Fees, Network } from "ark-ts";
import lodash from "lodash";
import { Subject } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";

@Component({
	selector: "page-top-wallet-details",
	templateUrl: "top-wallet-details.html",
	styleUrls: ["top-wallet-details.scss"],
	providers: [Clipboard],
})
export class TopWalletDetailsPage implements OnDestroy {
	public topWallet: Wallet;
	public currentNetwork: Network;
	public fees: Fees;

	public address: string;

	public ticker: MarketTicker;
	public marketHistory: MarketHistory;
	public marketCurrency: MarketCurrency;

	public emptyTransactions = false;
	public minConfirmations = constants.WALLET_MIN_NUMBER_CONFIRMATIONS;

	private unsubscriber$: Subject<void> = new Subject<void>();
	constructor(
		private navCtrl: NavController,
		private navParams: NavParams,
		private userDataProvider: UserDataProvider,
		private arkApiProvider: ArkApiProvider,
		private translateService: TranslateService,
		private marketDataProvider: MarketDataProvider,
		private zone: NgZone,
		private clipboard: Clipboard,
		private loadingCtrl: LoadingController,
		private settingsDataProvider: SettingsDataProvider,
		private toastProvider: ToastProvider,
		private modalCtrl: ModalController,
	) {
		this.topWallet = new Wallet().deserialize(this.navParams.get("wallet"));

		this.address = this.topWallet.address;

		if (!this.topWallet) {
			this.navCtrl.pop();
		}

		this.currentNetwork = this.userDataProvider.currentNetwork;
	}

	private refreshAllData() {
		this.refreshTransactions();
	}

	private load() {
		this.arkApiProvider.fees.subscribe(fees => (this.fees = fees));
		if (this.marketDataProvider.cachedTicker) {
			this.setTicker(this.marketDataProvider.cachedTicker);
		}

		this.marketDataProvider.history.subscribe(
			history => (this.marketHistory = history),
		);

		if (lodash.isEmpty(this.topWallet)) {
			this.navCtrl.pop();
			return;
		}

		const transactions = this.topWallet.transactions;
		this.emptyTransactions = lodash.isEmpty(transactions);

		// search for new transactions immediately
		if (this.emptyTransactions && !this.topWallet.isCold) {
			this.translateService
				.get("TRANSACTIONS_PAGE.FETCHING_TRANSACTIONS")
				.subscribe(async translation => {
					const loader = await this.loadingCtrl.create({
						message: `${translation}...`,
					});

					loader.present();

					this.refreshTransactions(loader);
				});
		}
	}

	private setTicker(ticker) {
		this.ticker = ticker;
		this.settingsDataProvider.settings.subscribe(settings => {
			this.marketCurrency = this.ticker.getCurrency({
				code: settings.currency,
			});
		});
	}

	private refreshTransactions(loader?: any) {
		this.zone.runOutsideAngular(() => {
			this.arkApiProvider.client
				.getTransactionList(this.address)
				.pipe(
					finalize(() =>
						this.zone.run(() => {
							if (loader) {
								if (loader instanceof IonRefresher) {
									loader.complete();
								} else {
									loader.dismiss();
								}
							}
							this.emptyTransactions = lodash.isEmpty(
								this.topWallet.transactions,
							);
						}),
					),
					takeUntil(this.unsubscriber$),
				)
				.subscribe(response => {
					if (response && response.success) {
						this.topWallet.loadTransactions(response.transactions);
						this.topWallet.lastUpdate = new Date().getTime();
						this.topWallet.isCold = lodash.isEmpty(
							response.transactions,
						);
					}
				});
		});
	}

	openTransactionShow(tx: Transaction) {
		if (this.topWallet) {
			this.navCtrl.navigateForward("/transaction/show", {
				queryParams: {
					transaction: tx,
					symbol: this.currentNetwork.symbol,
					equivalentAmount: tx.getAmountEquivalent(
						this.marketCurrency,
						this.marketHistory,
					),
					equivalentSymbol: this.marketCurrency.symbol,
				},
			});
		} else {
			this.toastProvider.error(
				"WALLETS_PAGE.WARNING_SELECT_WALLET_TRANSACTION_LOOKUP",
			);
		}
	}

	copyAddress() {
		this.clipboard.copy(this.topWallet.address).then(
			() => this.toastProvider.success("COPIED_CLIPBOARD"),
			() => this.toastProvider.error("COPY_CLIPBOARD_FAILED"),
		);
	}

	doRefresh(refresher: IonRefresher) {
		this.refreshTransactions(refresher);
	}

	dismiss() {
		this.modalCtrl.dismiss();
	}

	ionViewDidEnter() {
		this.load();

		this.refreshAllData();
	}

	ngOnDestroy() {
		this.unsubscriber$.next();
		this.unsubscriber$.complete();
	}
}
