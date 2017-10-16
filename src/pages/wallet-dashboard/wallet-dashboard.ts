import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ActionSheetController, ModalController, AlertController } from 'ionic-angular';

import { Profile, Wallet, Transaction, MarketTicker, MarketCurrency, MarketHistory } from '@models/model';
import { UserDataProvider } from '@providers/user-data/user-data';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { MarketDataProvider } from '@providers/market-data/market-data';

import lodash from 'lodash';
import { Network, Fees } from 'ark-ts';

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
  public fees: Fees;
  public wallet: Wallet;

  public address: string;

  public ticker: MarketTicker;
  public marketHistory: MarketHistory;
  public marketCurrency: MarketCurrency;

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userDataProvider: UserDataProvider,
    public arkApiProvider: ArkApiProvider,
    public actionSheetCtrl: ActionSheetController,
    public translateService: TranslateService,
    public marketDataProvider: MarketDataProvider,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
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
      let delegateItem =  {
        text: translation['Register delegate'],
        role: 'delegate',
        icon: !this.platform.is('ios') ? 'contact' : '',
        handler: () => {
          this.openRegisterDelegateModal();
        },
      };

      let secondPassphraseItem = {
        text: translation['2nd passphrase'],
        role: '2ndpassphrase',
        icon: !this.platform.is('ios') ? 'lock' : '',
        handler: () => {
          this.openRegisterSecondPassphrase();
        },
      };

      let buttons = [
        {
          text: translation['Label'],
          role: 'label',
          icon: !this.platform.is('ios') ? 'pricetag' : '',
          handler: () => {
            this.openLabelModal();
          },
        }, {
          text: translation['Delete wallet'],
          role: 'delete',
          icon: !this.platform.is('ios') ? 'trash' : '',
          handler: () => {
            this.showDeleteConfirm();
          }
        }, {
          text: translation['Cancel'],
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : ''
        }
      ];

      // TODO: Delegate item
      if (!this.wallet.secondSignature) buttons.unshift(secondPassphraseItem);

      let action = this.actionSheetCtrl.create({buttons});

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
    this.arkApiProvider.api.transaction.list({
      recipientId: this.address,
      senderId: this.address,
      orderBy: 'timestamp:desc',
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
    this.arkApiProvider.api.account.get({ address: this.address }).subscribe((response) => {
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
    this.userDataProvider.walletSave(this.wallet);
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

  openLabelModal() {
    let modal = this.modalCtrl.create('WalletLabelModalPage', {'label': this.wallet.label });

    modal.onDidDismiss((data) => {
      if (lodash.isEmpty(data)) return;

      this.wallet.label = data;
      this.saveWallet();
    });

    modal.present();
  }

  openRegisterDelegateModal() {
    this.fees = this.arkApiProvider.fees;

    let modal = this.modalCtrl.create('WalletRegisterDelegateModalPage', {
      fee: this.fees.delegate,
      symbol: this.network.symbol,
    });

    modal.onDidDismiss((name) => {
      if (lodash.isEmpty(name)) return;

      // TODO: Get pin code
      // this.arkApiProvider.api.transaction.createDelegate();
    });

    modal.present();
  }

  openRegisterSecondPassphrase() {
    this.fees = this.arkApiProvider.fees;

    let modal = this.modalCtrl.create('WalletRegisterSecondPassphrasePage', {
      fee: this.fees.secondsignature,
      symbol: this.network.symbol,
    });

    modal.onDidDismiss((passphrase) => {
      if (lodash.isEmpty(passphrase)) return;

      // TODO: Get pin code
      // this.arkApiProvider.api.transaction.createDelegate();
    });

    modal.present();
  }

  showDeleteConfirm() {
    this.translateService.get(['Are you sure?', 'Confirm', 'Cancel']).subscribe((translation) => {
      let confirm = this.alertCtrl.create({
        title: translation['Are you sure?'],
        buttons: [
          {
            text: translation['Cancel']
          },
          {
            text: translation['Confirm'],
            handler: () => {
              this.delete();
            }
          }
        ]
      });
      confirm.present();
    });
  }

  delete() {
    // TODO:
    console.log('delete');
  }

  load() {
    // TODO: LoadingController
    setInterval(() => {
      this.refreshData();
    }, constants.WALLET_REFRESH_TRANSACTIONS_MILLISECONDS);

    setInterval(() => this.refreshPrice(), constants.WALLET_REFRESH_PRICE_MILLISECONDS);
  }

  ngOnInit() {
    this.profile = this.userDataProvider.profileActive;
    this.network = this.userDataProvider.networkActive;
    this.fees = this.arkApiProvider.fees;
    this.wallet = this.userDataProvider.walletGet(this.address);

    let transactions = this.wallet.transactions;
    if (transactions) this.wallet.loadTransactions(transactions);

    this.refreshData();
    this.refreshPrice();
  }

  ionViewDidLoad() {
    this.load();
  }

}
