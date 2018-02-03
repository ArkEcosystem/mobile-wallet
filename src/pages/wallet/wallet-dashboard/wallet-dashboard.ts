import {Component, NgZone, OnDestroy, ViewChild} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  ActionSheetController,
  ModalController,
  AlertController,
  LoadingController,
  Loading,
  Content
} from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/finally';

import { Profile, Wallet, Transaction, MarketTicker, MarketCurrency, MarketHistory, WalletKeys } from '@models/model';
import { UserDataProvider } from '@providers/user-data/user-data';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { MarketDataProvider } from '@providers/market-data/market-data';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';

import lodash from 'lodash';
import { Network, Fees, TransactionDelegate, PrivateKey  } from 'ark-ts';

import { TranslateService } from '@ngx-translate/core';

import * as constants from '@app/app.constants';
import { PinCodeComponent } from '@components/pin-code/pin-code';
import { ConfirmTransactionComponent } from '@components/confirm-transaction/confirm-transaction';
import { Clipboard } from '@ionic-native/clipboard';
import { ToastProvider } from '@providers/toast/toast';

@IonicPage()
@Component({
  selector: 'page-wallet-dashboard',
  templateUrl: 'wallet-dashboard.html',
  providers: [Clipboard],
})
export class WalletDashboardPage implements OnDestroy {
  @ViewChild(Content) content: Content;
  @ViewChild('pinCode') pinCode: PinCodeComponent;
  @ViewChild('confirmTransaction') confirmTransaction: ConfirmTransactionComponent;

  public profile: Profile;
  public network: Network;
  public fees: Fees;
  public wallet: Wallet;

  public address: string;

  public ticker: MarketTicker;
  public marketHistory: MarketHistory;
  public marketCurrency: MarketCurrency;

  public onEnterPinCode;
  private newDelegateName: string;
  private newSecondPassphrase: string;

  public emptyTransactions = false;
  public minConfirmations = constants.WALLET_MIN_NUMBER_CONFIRMATIONS;

  private unsubscriber$: Subject<void> = new Subject<void>();

  private refreshDataIntervalListener;
  private refreshTickerIntervalListener;

  constructor(
    private platform: Platform,
    private navCtrl: NavController,
    private navParams: NavParams,
    private userDataProvider: UserDataProvider,
    private arkApiProvider: ArkApiProvider,
    private actionSheetCtrl: ActionSheetController,
    private translateService: TranslateService,
    private marketDataProvider: MarketDataProvider,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private settingsDataProvider: SettingsDataProvider,
    private zone: NgZone,
    private clipboard: Clipboard,
    private toastProvider: ToastProvider,
  ) {
    this.address = this.navParams.get('address');

    if (!this.address) { this.navCtrl.popToRoot(); }

    this.profile = this.userDataProvider.currentProfile;
    this.network = this.userDataProvider.currentNetwork;
    this.wallet = this.userDataProvider.getWalletByAddress(this.address);
  }

  copyAddress() {
    this.clipboard.copy(this.address).then(() => this.toastProvider.success('COPIED_CLIPBOARD'), (err) => this.toastProvider.error(err));
  }

  presentWalletActionSheet() {
    this.translateService.get([
      'WALLETS_PAGE.LABEL',
      'DELEGATES_PAGE.DELEGATES',
      'DELEGATES_PAGE.REGISTER_DELEGATE',
      'WALLETS_PAGE.SECOND_PASSPHRASE',
      'SETTINGS_PAGE.WALLET_BACKUP',
      'WALLETS_PAGE.REMOVE_WALLET',
    ]).takeUntil(this.unsubscriber$).subscribe((translation) => {
      const delegateItem =  {
        text: translation['DELEGATES_PAGE.REGISTER_DELEGATE'],
        role: 'delegate',
        icon: !this.platform.is('ios') ? 'ios-contact-outline' : '',
        handler: () => {
          this.presentRegisterDelegateModal();
        },
      };

      const delegatesItem = {
          text: translation['DELEGATES_PAGE.DELEGATES'],
          role: 'label',
          icon: !this.platform.is('ios') ? 'ios-people-outline' : '',
          handler: () => {
            this.presentDelegatesModal();
          },
      };

      const buttons = [
        {
          text: translation['WALLETS_PAGE.LABEL'],
          role: 'label',
          icon: !this.platform.is('ios') ? 'ios-bookmark-outline' : '',
          handler: () => {
            this.presentLabelModal();
          },
        }, {
          text: translation['WALLETS_PAGE.REMOVE_WALLET'],
          role: 'delete',
          icon: !this.platform.is('ios') ? 'ios-trash-outline' : '',
          handler: () => {
            this.presentDeleteWalletConfirm();
          }
        }
      ];

      const backupItem = {
        text: translation['SETTINGS_PAGE.WALLET_BACKUP'],
        role: 'label',
        icon: !this.platform.is('ios') ? 'ios-briefcase-outline' : '',
        handler: () => {
          this.presentWalletBackupPage();
        }
      };

      // DEPRECATED:
      // if (!this.wallet.isWatchOnly && !this.wallet.secondSignature) buttons.unshift(secondPassphraseItem);
      if (!this.wallet.isWatchOnly) { buttons.unshift(delegatesItem); } // "Watch Only" address can't vote
      if (!this.wallet.isWatchOnly && !this.wallet.isDelegate) { buttons.unshift(delegateItem); }
      if (!this.wallet.isWatchOnly) { buttons.splice(buttons.length - 1, 0, backupItem); }

      const action = this.actionSheetCtrl.create({buttons});

      action.present();
    });
  }

  presentWalletBackupPage() {
    this.onEnterPinCode = this.showBackup;
    this.pinCode.open('PIN_CODE.DEFAULT_MESSAGE', true);
  }

  private showBackup(keys: WalletKeys) {
    if (!keys) { return; }

    const modal = this.modalCtrl.create('WalletBackupModal', {
      title: 'SETTINGS_PAGE.WALLET_BACKUP',
      keys,
    });

    modal.present();
  }

  presentAddActionSheet() {
    this.translateService.get(['TRANSACTIONS_PAGE.SEND', 'TRANSACTIONS_PAGE.RECEIVE'])
      .takeUntil(this.unsubscriber$)
      .subscribe((translation) => {
        const buttons: Array<object> = [
          {
            text: translation['TRANSACTIONS_PAGE.RECEIVE'],
            role: 'receive',
            icon: !this.platform.is('ios') ? 'ios-arrow-round-down' : '',
            handler: () => {
              return this.openTransactionReceive();
            }
          }
        ];
        if (!this.wallet.isWatchOnly) {
          buttons.push({
            text: translation['TRANSACTIONS_PAGE.SEND'],
            role: 'send',
            icon: !this.platform.is('ios') ? 'ios-arrow-round-up' : '',
            handler: () => {
              return this.navCtrl.push('TransactionSendPage');
            }
          });
        }

        const action = this.actionSheetCtrl.create({
          buttons: buttons
        });

        action.present();
    });
  }

  openTransactionShow(tx: Transaction) {
    this.navCtrl.push('TransactionShowPage', {
      transaction: tx,
      symbol: this.network.symbol,
      equivalentAmount: tx.getAmountEquivalent(this.marketCurrency, this.marketHistory),
      equivalentSymbol: this.marketCurrency.symbol,
    });
  }

  openTransactionReceive() {
    this.navCtrl.push('TransactionReceivePage', {
      address: this.address,
      token: this.network.token,
    });
  }

  presentDelegatesModal() {
    this.navCtrl.push('DelegatesPage');
  }

  presentLabelModal() {
    const modal = this.modalCtrl.create('SetLabelPage', {'label': this.wallet.label }, { cssClass: 'inset-modal-tiny' });

    modal.onDidDismiss((data) => {
      if (lodash.isEmpty(data)) { return; }

      this.zone.run(() => this.wallet.label = data);
      this.saveWallet();
    });

    modal.present();
  }

  presentRegisterDelegateModal() {
    const modal = this.modalCtrl.create('RegisterDelegatePage', null, { cssClass: 'inset-modal' });

    modal.onDidDismiss((name) => {
      if (lodash.isEmpty(name)) { return; }

      this.newDelegateName = name;
      this.onEnterPinCode = this.createDelegate;
      this.pinCode.open('PIN_CODE.TYPE_PIN_SIGN_TRANSACTION', true, true);

    });

    modal.present();
  }

  presentRegisterSecondPassphraseModal() {
    const modal = this.modalCtrl.create('RegisterSecondPassphrasePage', null, { cssClass: 'inset-modal-large'});

    modal.onDidDismiss((newSecondPassphrase) => {
      if (lodash.isEmpty(newSecondPassphrase)) { return; }

      this.newSecondPassphrase = newSecondPassphrase;
      this.onEnterPinCode = this.createSignature;
      this.pinCode.open('PIN_CODE.TYPE_PIN_SIGN_TRANSACTION', true);

    });

    modal.present();
  }

  presentDeleteWalletConfirm() {
    this.translateService.get(['ARE_YOU_SURE', 'CONFIRM', 'CANCEL', 'WALLETS_PAGE.REMOVE_WALLET_TEXT'])
      .takeUntil(this.unsubscriber$)
      .subscribe((translation) => {
        const confirm = this.alertCtrl.create({
          title: translation.ARE_YOU_SURE,
          message: translation['WALLETS_PAGE.REMOVE_WALLET_TEXT'],
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

  private createDelegate(keys: WalletKeys) {
    const publicKey = this.wallet.publicKey || PrivateKey.fromSeed(keys.key).getPublicKey().toHex();

    const transaction = <TransactionDelegate>{
      passphrase: keys.key,
      secondPassphrase: keys.secondKey,
      username: this.newDelegateName,
      publicKey
    };

    this.arkApiProvider.api.transaction.createDelegate(transaction)
      .takeUntil(this.unsubscriber$)
      .subscribe((data) => {
        this.confirmTransaction.open(data, keys);
      });
  }

  private createSignature(keys: WalletKeys) {
    keys.secondPassphrase = this.newSecondPassphrase;

    this.arkApiProvider.api.transaction
    .createSignature(keys.key, keys.secondPassphrase)
    .takeUntil(this.unsubscriber$)
    .subscribe((data) => {
      this.confirmTransaction.open(data, keys);
    });
  }

  private saveWallet() {
    this.userDataProvider.saveWallet(this.wallet);
  }

  private deleteWallet() {
    this.userDataProvider.removeWalletByAddress(this.wallet.address);
    this.navCtrl.setRoot('WalletListPage');
  }

  private refreshTransactions(save: boolean = true, loader?: Loading) {
    this.zone.runOutsideAngular(() => {
      this.arkApiProvider.api.transaction.list({
        recipientId: this.address,
        senderId: this.address,
        orderBy: 'timestamp:desc',
      })
      .finally(() => this.zone.run(() => {
        if (loader) { loader.dismiss(); }
        this.emptyTransactions = lodash.isEmpty(this.wallet.transactions);
      }))
      .takeUntil(this.unsubscriber$)
      .subscribe((response) => {
        if (response && response.success) {
          this.wallet.loadTransactions(response.transactions);
          this.wallet.lastUpdate = new Date().getTime();
          this.wallet.isCold = lodash.isEmpty(response.transactions);
          if (save) { this.saveWallet(); }
        }
      });
    });
  }

  private refreshPrice() {
    this.marketDataProvider.refreshPrice();
  }

  private refreshAccount(save: boolean = true) {
    this.arkApiProvider.api.account.get({ address: this.address }).takeUntil(this.unsubscriber$).subscribe((response) => {
      if (response.success) {
        this.wallet.deserialize(response.account);
        if (save) { this.saveWallet(); }
      }
    });
  }

  private refreshAllData() {
    this.refreshAccount(false);
    this.refreshTransactions(false);
    this.saveWallet();
  }

  private onUpdateMarket() {
    this.marketDataProvider.onUpdateTicker$.takeUntil(this.unsubscriber$).subscribe((ticker) => this.setTicker(ticker));
  }

  private setTicker(ticker) {
    this.ticker = ticker;
    this.settingsDataProvider.settings.subscribe((settings) => {
      this.marketCurrency = this.ticker.getCurrency({ code: settings.currency });
    });
  }

  private onUpdateWallet() {
    this.userDataProvider.onUpdateWallet$
      .takeUntil(this.unsubscriber$)
      .debounceTime(500)
      .subscribe((wallet) => {
        if (!lodash.isEmpty(wallet) && this.wallet.address === wallet.address) { this.wallet = wallet; }
      });
  }

  private load() {

    this.arkApiProvider.fees.subscribe((fees) => this.fees = fees);
    this.marketDataProvider.ticker.subscribe((ticker) => this.setTicker(ticker));
    this.marketDataProvider.history.subscribe((history) => this.marketHistory = history);

    if (lodash.isEmpty(this.wallet)) {
      this.navCtrl.popToRoot();
      return;
    }

    this.userDataProvider.setCurrentWallet(this.wallet);

    const transactions = this.wallet.transactions;
    this.emptyTransactions = lodash.isEmpty(transactions);

    // search for new transactions immediately
    if (this.emptyTransactions && !this.wallet.isCold) {
      this.translateService.get('TRANSACTIONS_PAGE.FETCHING_TRANSACTIONS').takeUntil(this.unsubscriber$).subscribe((translation) => {
        const loader = this.loadingCtrl.create({
          content: `${translation}...`,
        });

        loader.present();

        this.refreshTransactions(true, loader);
      });
    }
  }

  ionViewDidEnter() {
    this.load();

    this.refreshAllData();
    this.refreshPrice();

    this.refreshDataIntervalListener = setInterval(() => this.refreshAllData(), constants.WALLET_REFRESH_TRANSACTIONS_MILLISECONDS);
    this.refreshTickerIntervalListener = setInterval(() => this.refreshPrice(), constants.WALLET_REFRESH_PRICE_MILLISECONDS);

    this.onUpdateWallet();
    this.onUpdateMarket();

    this.content.resize();
  }

  ngOnDestroy() {
    clearInterval(this.refreshDataIntervalListener);
    clearInterval(this.refreshTickerIntervalListener);

    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
