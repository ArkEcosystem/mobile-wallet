import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ActionSheetController } from 'ionic-angular';

import { Profile, Wallet, Transaction, MarketTicker, MarketCurrency, MarketHistory } from '@models/model';
import { LocalDataProvider } from '@providers/local-data/local-data';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { MarketDataProvider } from '@providers/market-data/market-data';

import lodash from 'lodash';
import { Network } from 'ark-ts';

import { TranslateService } from '@ngx-translate/core';

import * as constants from '@app/app.constants';

@IonicPage()
@Component({
  selector: 'page-wallet-dashboard',
  templateUrl: 'wallet-dashboard.html',
})
export class WalletDashboardPage {

  public profile: Profile;
  public network: Network;
  public wallet: Wallet;

  public address: string;

  public ticker: MarketTicker;
  public marketHistory: MarketHistory;
  public marketCurrency: MarketCurrency;

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public localDataProvider: LocalDataProvider,
    public arkApiProvider: ArkApiProvider,
    public actionSheetCtrl: ActionSheetController,
    public translateService: TranslateService,
    public marketDataProvider: MarketDataProvider,
  ) {
    this.address = this.navParams.get('address');

    this.marketDataProvider.historyObserver.subscribe((history) => this.marketHistory = history);
    this.marketDataProvider.tickerObserver.subscribe((ticker) => {
      this.ticker = ticker;
      // TODO: Get currency from settings
      if (ticker) this.marketCurrency = ticker.getCurrency({ code: 'usd' });
    });
  }

  presentWalletActionSheet() {
    this.translateService.get(['Label', 'Register delegate', '2nd passphrase', 'Delete wallet', 'Cancel']).subscribe((translation) => {
      let action = this.actionSheetCtrl.create({
        buttons: [
          {
            text: translation['Label'],
            role: 'label',
            icon: !this.platform.is('ios') ? 'pricetag' : '',
          }, {
            text: translation['Register delegate'],
            role: 'delegate',
            icon: !this.platform.is('ios') ? 'contact' : '',
          }, {
            text: translation['2nd passphrase'],
            role: '2ndpassphrase',
            icon: !this.platform.is('ios') ? 'lock' : '',
          }, {
            text: translation['Delete wallet'],
            role: 'delete',
            icon: !this.platform.is('ios') ? 'trash' : '',
          }, {
            text: translation['Cancel'],
            role: 'cancel',
            icon: !this.platform.is('ios') ? 'close' : ''
          }
        ]
      });

      action.present();
    });
  }

  presentAddActionSheet() {
    this.translateService.get(['Send', 'Receive', 'Cancel']).subscribe((translation) => {
      let action = this.actionSheetCtrl.create({
        buttons: [
          {
            text: translation['Receive'],
            role: 'receive',
            icon: !this.platform.is('ios') ? 'arrow-round-down' : '',
            handler: () => {
              return this.openTransactionReceive();
            }
          }, {
            text: translation['Send'],
            role: 'send',
            icon: !this.platform.is('ios') ? 'arrow-round-up' : ''
          }, {
            text: translation['Cancel'],
            role: 'cancel',
            icon: !this.platform.is('ios') ? 'close' : ''
          }
        ]
      });

      action.present();
    });
  }

  refreshTransactions(save: boolean = true) {
    this.arkApiProvider.api().transaction.list({
      recipientId: this.address,
      senderId: this.address,
    }).subscribe((response) => {
      if (response && response.success) {
        this.wallet.loadTransactions(response.transactions);
        this.wallet.lastUpdate = new Date().getTime();

        if (save) this.saveWallet();
      }
    });
  }

  refreshPrice() {
    this.marketDataProvider.refreshPrice();
  }

  refreshAccount(save: boolean = true) {
    this.arkApiProvider.api().account.get({ address: this.address }).subscribe((response) => {
      if (response.success) {
        this.wallet.deserialize(response.account);
        if (save) this.saveWallet();
      }
    });
  }

  refreshData() {
    this.refreshAccount(false);
    this.refreshTransactions(false);
    this.saveWallet();
  }

  saveWallet() {
    this.localDataProvider.walletSave(this.wallet);
  }

  openTransactionShow(tx: Transaction) {
    this.navCtrl.push('TransactionShowPage', {
      transaction: tx,
      symbol: this.network.symbol,
      equivalentAmount: tx.getAmountEquivalent(this.marketHistory, this.marketCurrency),
      equivalentSymbol: this.marketCurrency.symbol,
    });
  }

  openTransactionReceive() {
    this.navCtrl.push('TransactionReceivePage', {
      address: this.address,
      token: this.network.token,
    });
  }

  load() {
    // TODO: LoadingController
    setInterval(() => {
      this.refreshData();
    }, constants.WALLET_REFRESH_TRANSACTIONS_MILLISECONDS);

    setInterval(() => this.refreshPrice(), constants.WALLET_REFRESH_PRICE_MILLISECONDS);
  }

  ngOnInit() {
    this.profile = this.localDataProvider.profileActive();
    this.network = this.localDataProvider.networkActive();
    this.wallet = this.localDataProvider.walletGet(this.address);

    let transactions = this.wallet.transactions;
    if (transactions) this.wallet.loadTransactions(transactions);

    this.refreshData();
    this.refreshPrice();
  }

  ionViewDidLoad() {
    this.load();
  }

}
