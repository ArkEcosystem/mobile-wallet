import {Component, NgZone, OnDestroy, OnInit} from '@root/node_modules/@angular/core';
import {IonicPage, Loading, LoadingController, NavController, NavParams, Refresher, ViewController} from '@root/node_modules/ionic-angular';
import {Wallet} from '@models/wallet';
import {Fees, Network} from '@root/node_modules/ark-ts';
import {UserDataProvider} from '@providers/user-data/user-data';
import {MarketCurrency, MarketHistory, MarketTicker} from '@models/market';
import {Clipboard} from '@root/node_modules/@ionic-native/clipboard';
import {ToastProvider} from '@providers/toast/toast';
import {ArkApiProvider} from '@providers/ark-api/ark-api';
import lodash from 'lodash';
import {Subject} from '@root/node_modules/rxjs';
import * as constants from '@app/app.constants';
import {Transaction} from '@models/transaction';
import {MarketDataProvider} from '@providers/market-data/market-data';
import {TranslateService} from '@root/node_modules/@ngx-translate/core';
import {SettingsDataProvider} from '@providers/settings-data/settings-data';

@IonicPage()
@Component({
  selector: 'page-top-wallet-details',
  templateUrl: 'top-wallet-details.html',
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
    private viewCtrl: ViewController,
  ) {
    this.topWallet = new Wallet().deserialize(this.navParams.get('wallet'));

    this.address = this.topWallet.address;

    if (!this.topWallet) { this.navCtrl.popToRoot(); }

    this.currentNetwork = this.userDataProvider.currentNetwork;
  }

  private refreshAllData() {
    this.refreshTransactions();
  }

  private load() {
    this.arkApiProvider.fees.subscribe((fees) => this.fees = fees);
    if (this.marketDataProvider.cachedTicker) {
      this.setTicker(this.marketDataProvider.cachedTicker);
    }

    this.marketDataProvider.history.subscribe((history) => this.marketHistory = history);

    if (lodash.isEmpty(this.topWallet)) {
      this.navCtrl.popToRoot();
      return;
    }

    const transactions = this.topWallet.transactions;
    this.emptyTransactions = lodash.isEmpty(transactions);

    // search for new transactions immediately
    if (this.emptyTransactions && !this.topWallet.isCold) {
      this.translateService.get('TRANSACTIONS_PAGE.FETCHING_TRANSACTIONS').takeUntil(this.unsubscriber$).subscribe((translation) => {
        const loader = this.loadingCtrl.create({
          content: `${translation}...`,
        });

        loader.present();

        this.refreshTransactions(loader);
      });
    }
  }

  private setTicker(ticker) {
    this.ticker = ticker;
    this.settingsDataProvider.settings.subscribe((settings) => {
      this.marketCurrency = this.ticker.getCurrency({ code: settings.currency });
    });
  }

  private refreshTransactions(loader?: Loading|Refresher) {
    this.zone.runOutsideAngular(() => {
      this.arkApiProvider.client.getTransactionList(this.address)
        .finally(() => this.zone.run(() => {
          if (loader) {
            if (loader instanceof Loading) {
              loader.dismiss();
            } else if (loader instanceof Refresher) {
              loader.complete();
            }
          }
          this.emptyTransactions = lodash.isEmpty(this.topWallet.transactions);
        }))
        .takeUntil(this.unsubscriber$)
        .subscribe((response) => {
          if (response && response.success) {
            this.topWallet.loadTransactions(response.transactions, this.arkApiProvider.network);
            this.topWallet.lastUpdate = new Date().getTime();
            this.topWallet.isCold = lodash.isEmpty(response.transactions);
          }
        });
    });
  }

  openTransactionShow(tx: Transaction) {
    if (this.userDataProvider.currentWallet) {
      this.navCtrl.push('TransactionShowPage', {
        transaction: tx,
        symbol: this.currentNetwork.symbol,
        equivalentAmount: tx.getAmountEquivalent(this.marketCurrency, this.marketHistory),
        equivalentSymbol: this.marketCurrency.symbol,
      });
    } else {
      this.toastProvider.error('WALLETS_PAGE.WARNING_SELECT_WALLET_TRANSACTION_LOOKUP');
    }

  }

  copyAddress() {
    this.clipboard.copy(this.topWallet.address).then(
      () => this.toastProvider.success('COPIED_CLIPBOARD'),
      () => this.toastProvider.error('COPY_CLIPBOARD_FAILED'));
  }

  doRefresh(refresher: Refresher) {
    this.refreshTransactions(refresher);
  }

  dismiss() {
    this.viewCtrl.dismiss();
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
