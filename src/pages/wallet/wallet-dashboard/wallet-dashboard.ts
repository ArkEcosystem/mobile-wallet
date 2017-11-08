import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ActionSheetController, ModalController, AlertController, LoadingController, Loading } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { Profile, Wallet, Transaction, MarketTicker, MarketCurrency, MarketHistory } from '@models/model';
import { UserDataProvider } from '@providers/user-data/user-data';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { MarketDataProvider } from '@providers/market-data/market-data';

import lodash from 'lodash';
import { Network, Fees, TransactionDelegate  } from 'ark-ts';

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

  public emptyTransactions: boolean = false;
  public minConfirmations = constants.WALLET_MIN_NUMBER_CONFIRMATIONS;

  private _unsubscriber: Subject<void> = new Subject<void>();

  private _refreshDataIntervalListener;
  private _refreshTickerIntervalListener;

  constructor(
    private _platform: Platform,
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _userDataProvider: UserDataProvider,
    private _arkApiProvider: ArkApiProvider,
    private _actionSheetCtrl: ActionSheetController,
    private _translateService: TranslateService,
    private _marketDataProvider: MarketDataProvider,
    private _modalCtrl: ModalController,
    private _alertCtrl: AlertController,
    private _loadingCtrl: LoadingController,
    private zone: NgZone,
  ) {
    this.address = this._navParams.get('address');

    this._marketDataProvider.onUpdateHistory$.takeUntil(this._unsubscriber).subscribe((history) => this.marketHistory = history);
    this._marketDataProvider.onUpdateTicker$.takeUntil(this._unsubscriber).subscribe((ticker) => {
      this.ticker = ticker;
      // TODO: Get currency from settings
      if (ticker) this.marketCurrency = ticker.getCurrency({ code: 'usd' });
    });
  }

  presentWalletActionSheet() {
    this._translateService.get([
      'WALLETS_PAGE.LABEL',
      'DELEGATES_PAGE.REGISTER_DELEGATE',
      'WALLETS_PAGE.SECOND_PASSPHRASE',
      'WALLETS_PAGE.REMOVE_WALLET',
      'CANCEL'
    ]).takeUntil(this._unsubscriber).subscribe((translation) => {
      let delegateItem =  {
        text: translation['DELEGATES_PAGE.REGISTER_DELEGATE'],
        role: 'delegate',
        icon: !this._platform.is('ios') ? 'contact' : '',
        handler: () => {
          this.openRegisterDelegateModal();
        },
      };

      let secondPassphraseItem = {
        text: translation['WALLETS_PAGE.SECOND_PASSPHRASE'],
        role: '2ndpassphrase',
        icon: !this._platform.is('ios') ? 'lock' : '',
        handler: () => {
          this.openRegisterSecondPassphrase();
        },
      };

      let buttons = [
        {
          text: translation['WALLETS_PAGE.LABEL'],
          role: 'label',
          icon: !this._platform.is('ios') ? 'pricetag' : '',
          handler: () => {
            this.openLabelModal();
          },
        }, {
          text: translation['WALLETS_PAGE.REMOVE_WALLET'],
          role: 'delete',
          icon: !this._platform.is('ios') ? 'trash' : '',
          handler: () => {
            this.showDeleteConfirm();
          }
        }, {
          text: translation['CANCEL'],
          role: 'cancel',
          icon: !this._platform.is('ios') ? 'close' : ''
        }
      ];

      // TODO: Delegate item
      if (!this.wallet.secondSignature) buttons.unshift(secondPassphraseItem);
      if (!this.wallet.isDelegate) buttons.unshift(delegateItem);

      let action = this._actionSheetCtrl.create({buttons});

      action.present();
    });
  }

  presentAddActionSheet() {
    this._translateService.get(['TRANSACTIONS_PAGE.SEND', 'TRANSACTIONS_PAGE.RECEIVE', 'CANCEL']).takeUntil(this._unsubscriber).subscribe((translation) => {
      let action = this._actionSheetCtrl.create({
        buttons: [
          {
            text: translation['TRANSACTIONS_PAGE.RECEIVE'],
            role: 'receive',
            icon: !this._platform.is('ios') ? 'arrow-round-down' : '',
            handler: () => {
              return this.openTransactionReceive();
            }
          }, {
            text: translation['TRANSACTIONS_PAGE.SEND'],
            role: 'send',
            icon: !this._platform.is('ios') ? 'arrow-round-up' : ''
          }, {
            text: translation.CANCEL,
            role: 'cancel',
            icon: !this._platform.is('ios') ? 'close' : ''
          }
        ]
      });

      action.present();
    });
  }

  refreshTransactions(save: boolean = true, loader?: Loading) {
    this._arkApiProvider.api.transaction.list({
      recipientId: this.address,
      senderId: this.address,
      orderBy: 'timestamp:desc',
    })
    .finally(() => {
      if (loader) loader.dismiss();
      this.emptyTransactions = lodash.isEmpty(this.wallet.transactions);
    })
    .takeUntil(this._unsubscriber)
    .subscribe((response) => {
      if (response && response.success) {
        this.wallet.loadTransactions(response.transactions);
        this.wallet.lastUpdate = new Date().getTime();
        if (save) this.saveWallet();
      }
    });
  }

  refreshPrice() {
    this._marketDataProvider.refreshPrice();
  }

  refreshAccount(save: boolean = true) {
    this._arkApiProvider.api.account.get({ address: this.address }).takeUntil(this._unsubscriber).subscribe((response) => {
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
    this._userDataProvider.saveWallet(this.wallet);
  }

  openTransactionShow(tx: Transaction) {
    this._navCtrl.push('TransactionShowPage', {
      transaction: tx,
      symbol: this.network.symbol,
      equivalentAmount: tx.getAmountEquivalent(this.marketCurrency, this.marketHistory),
      equivalentSymbol: this.marketCurrency.symbol,
    });
  }

  openTransactionReceive() {
    this._navCtrl.push('TransactionReceivePage', {
      address: this.address,
      token: this.network.token,
    });
  }

  openLabelModal() {
    let modal = this._modalCtrl.create('SetLabelPage', {'label': this.wallet.label }, { cssClass: 'inset-modal' });

    modal.onDidDismiss((data) => {
      if (lodash.isEmpty(data)) return;

      this.zone.run(() => this.wallet.label = data);
      this.saveWallet();
    });

    modal.present();
  }

  openRegisterDelegateModal() {
    this.fees = this._arkApiProvider.fees;

    let modal = this._modalCtrl.create('RegisterDelegatePage', {
      fee: this.fees.delegate,
      symbol: this.network.symbol,
    }, { cssClass: 'inset-modal' });

    modal.onDidDismiss((name) => {
      if (lodash.isEmpty(name)) return;

      this.getPassphrases().then((passphrases) => {
        let transaction = <TransactionDelegate>{
          passphrase: passphrases['passphrase'],
          secondPassphrase: passphrases['secondPassphrase'],
          username: name,
          publicKey: this.wallet.publicKey,
        }

        this._arkApiProvider.api.transaction.createDelegate(transaction)
          .takeUntil(this._unsubscriber)
          .subscribe((data) => {
            this.confirmTransaction(data, passphrases);
          });

      }, () => {
        // TODO: Toast error
      })
    });

    modal.present();
  }

  openRegisterSecondPassphrase() {
    this.fees = this._arkApiProvider.fees;

    let modal = this._modalCtrl.create('RegisterSecondPassphrasePage', {
      fee: this.fees.secondsignature,
      symbol: this.network.symbol,
    }, { cssClass: 'inset-modal-large'});

    modal.onDidDismiss((newSecondPassphrase) => {
      if (lodash.isEmpty(newSecondPassphrase)) return;

      this.getPassphrases().then((passphrases) => {
        this._arkApiProvider.api.transaction
          .createSignature(passphrases['passphrase'], newSecondPassphrase)
          .takeUntil(this._unsubscriber)
          .subscribe((data) => {
            this.confirmTransaction(data, passphrases);
          });

      }, () => {
        // TODO: Toast error
      })
    });

    modal.present();
  }

  showDeleteConfirm() {
    this._translateService.get(['ARE_YOU_SURE', 'CONFIRM', 'CANCEL']).takeUntil(this._unsubscriber).subscribe((translation) => {
      let confirm = this._alertCtrl.create({
        title: translation.ARE_YOU_SURE,
        buttons: [
          {
            text: translation.CANCEL
          },
          {
            text: translation.CONFIRM,
            handler: () => {
              this.deleteWallet();
            }
          }
        ]
      });
      confirm.present();
    });
  }

  deleteWallet() {
    // TODO:
    console.log('delete');
  }

  private confirmTransaction(transaction: Transaction, passphrases: any) {
    // TODO: Confirmation page
    let modal = this._modalCtrl.create('TransactionConfirmPage', {
      transaction,
      passphrases,
      address: this.address,
    }, { cssClass: 'inset-modal', enableBackdropDismiss: true });

    modal.onDidDismiss((response) => {
      if (!response || lodash.isUndefined(response.status)) return;

      // if (response.status) {
        this._navCtrl.push('TransactionResponsePage', {
          response,
          passphrases,
          wallet: this.wallet,
        });
      // }
    });

    modal.present();
  }

  private getPassphrases(message?: string) {
    let msg = message || 'PIN_CODE.TYPE_PIN_SIGN_TRANSACTION';
    let modal = this._modalCtrl.create('PinCodePage', {
      message: msg,
      outputPassword: true,
      validatePassword: true,
    });

    modal.present();

    return new Promise((resolve, reject) => {
      modal.onDidDismiss((password) => {
        if (!password) {
          reject();
        } else {
          let passphrases = this._userDataProvider.getPassphrasesByWallet(this.wallet, password);
          resolve(passphrases);
        }
      });
    });
  }

  private onUpdateWallet() {
    this._userDataProvider.onUpdateWallet$
      .takeUntil(this._unsubscriber)
      .debounceTime(500)
      .subscribe((wallet) => {
        if (!lodash.isEmpty(wallet) && this.wallet.address == wallet.address) this.wallet = wallet;
      });
  }

  load() {
    this.profile = this._userDataProvider.currentProfile;
    this.network = this._userDataProvider.currentNetwork;
    this.fees = this._arkApiProvider.fees;
    this.wallet = this._userDataProvider.getWalletByAddress(this.address);

    if (lodash.isEmpty(this.wallet)) {
      this._navCtrl.popToRoot();
      return;
    }

    let transactions = this.wallet.transactions;

    if (!lodash.isEmpty(transactions)) {
      this.wallet.loadTransactions(transactions);
    } else {
      this._translateService.get('TRANSACTIONS_PAGE.FETCHING_TRANSACTIONS').takeUntil(this._unsubscriber).subscribe((translation) => {
        let loader = this._loadingCtrl.create({
          content: `${translation}...`,
        });

        loader.present();

        this.refreshTransactions(true, loader);
      });
    }
  }

  ngOnInit() {
    this._refreshDataIntervalListener = setInterval(() => this.refreshData(), constants.WALLET_REFRESH_TRANSACTIONS_MILLISECONDS);
    this._refreshTickerIntervalListener = setInterval(() => this.refreshPrice(), constants.WALLET_REFRESH_PRICE_MILLISECONDS);

    this.onUpdateWallet();
  }

  ionViewDidLoad() {
    this.load();

    this.refreshData();
    this.refreshPrice();
  }

  ngOnDestroy() {
    clearInterval(this._refreshDataIntervalListener);
    clearInterval(this._refreshTickerIntervalListener);

    this._unsubscriber.next();
    this._unsubscriber.complete();
  }

}
