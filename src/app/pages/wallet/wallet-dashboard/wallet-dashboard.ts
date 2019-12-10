import { Component, NgZone, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {
  NavController,
  ActionSheetController,
  ModalController,
  AlertController,
  LoadingController,
  IonRefresher,
  IonContent
} from '@ionic/angular';

import { Subject } from 'rxjs';

import { Profile, Wallet, Transaction, MarketTicker, MarketCurrency, MarketHistory, WalletKeys, TransactionEntity } from '@/models/model';
import { UserDataProvider } from '@/services/user-data/user-data';
import { ArkApiProvider } from '@/services/ark-api/ark-api';
import { MarketDataProvider } from '@/services/market-data/market-data';
import { SettingsDataProvider } from '@/services/settings-data/settings-data';

import lodash from 'lodash';
import dequal from 'dequal';

import { Network, Fees, TransactionDelegate, PrivateKey, TransactionType, Transaction as TransactionModel } from 'ark-ts';

import { TranslateService } from '@ngx-translate/core';

import * as constants from '@/app/app.constants';
import { PinCodeComponent } from '@/components/pin-code/pin-code';
import { ConfirmTransactionComponent } from '@/components/confirm-transaction/confirm-transaction';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ToastProvider } from '@/services/toast/toast';
import { RegisterDelegatePage } from './modal/register-delegate/register-delegate';
import { RegisterSecondPassphrasePage } from './modal/register-second-passphrase/register-second-passphrase';
import { SetLabelPage } from './modal/set-label/set-label';
import { WalletBackupModal } from '@/app/modals/wallet-backup/wallet-backup';
import { takeUntil, finalize, debounceTime } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-wallet-dashboard',
  templateUrl: 'wallet-dashboard.html',
  styleUrls: ['wallet-dashboard.scss'],
  providers: [Clipboard],
})
export class WalletDashboardPage implements OnInit, OnDestroy {
  @ViewChild('content', { read: IonContent, static: true })
  content: IonContent;

  @ViewChild('refresher', { read: IonRefresher, static: true })
  refresher: IonRefresher;

  @ViewChild('pinCode', { read: PinCodeComponent, static: true })
  pinCode: PinCodeComponent;

  @ViewChild('confirmTransaction', { read: ConfirmTransactionComponent, static: true })
  confirmTransaction: ConfirmTransactionComponent;

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
  private newDelegateFee: number;
  private newSecondPassphrase: string;

  public emptyTransactions = false;
  public minConfirmations = constants.WALLET_MIN_NUMBER_CONFIRMATIONS;

  private unsubscriber$: Subject<void> = new Subject<void>();

  private refreshDataIntervalListener;
  private refreshTickerIntervalListener;

  private transactions: TransactionEntity[] = [];

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
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
    this.address = this.route.snapshot.queryParamMap.get('address');

    if (!this.address) { this.navCtrl.pop() }

    this.profile = this.userDataProvider.currentProfile;
    this.network = this.userDataProvider.currentNetwork;
    this.setWallet(this.userDataProvider.getWalletByAddress(this.address));
  }

  copyAddress() {
    this.clipboard.copy(this.address).then(() => this.toastProvider.success('COPIED_CLIPBOARD'), (err) => this.toastProvider.error(err));
  }

  doRefresh(refresher: IonRefresher) {
    this.refreshAccount();
    this.refreshTransactions(true, refresher);
  }

  presentWalletActionSheet() {
    this.translateService.get([
      'WALLETS_PAGE.LABEL',
      'DELEGATES_PAGE.DELEGATES',
      'DELEGATES_PAGE.REGISTER_DELEGATE',
      'WALLETS_PAGE.SECOND_PASSPHRASE',
      'SETTINGS_PAGE.WALLET_BACKUP',
      'WALLETS_PAGE.REMOVE_WALLET',
      'WALLETS_PAGE.CONVERT_TO_FULL_WALLET',
      'WALLETS_PAGE.TOP_WALLETS'
    ]).subscribe(async (translation) => {
      const delegateItem =  {
        text: translation['DELEGATES_PAGE.REGISTER_DELEGATE'],
        role: 'delegate',
        icon: 'contact',
        handler: () => {
          this.presentRegisterDelegateModal();
        },
      };

      const delegatesItem = {
          text: translation['DELEGATES_PAGE.DELEGATES'],
          role: 'label',
          icon: 'people',
          handler: () => {
            this.presentDelegatesModal();
          },
      };

      const buttons = [
        {
          text: translation['WALLETS_PAGE.REMOVE_WALLET'],
          role: 'delete',
          icon: 'trash',
          handler: () => {
            this.presentDeleteWalletConfirm();
          }
        }
      ];

      // if the user is a delegate there's no need to show the create label page
      if (!this.wallet.username) {
        buttons.unshift({
          text: translation['WALLETS_PAGE.LABEL'],
          role: 'label',
          icon: 'bookmark',
          handler: () => {
            this.presentLabelModal();
          },
        });
      }

      const backupItem = {
        text: translation['SETTINGS_PAGE.WALLET_BACKUP'],
        role: 'label',
        icon: 'briefcase',
        handler: () => {
          this.presentWalletBackupPage();
        }
      };

      const topWalletsItem = {
        text: translation['WALLETS_PAGE.TOP_WALLETS'],
        role: 'label',
        icon: 'filing',
        handler: () => {
          this.presentTopWalletsModal();
        }
      };

      // DEPRECATED:
      // if (!this.wallet.isWatchOnly && !this.wallet.secondSignature) buttons.unshift(secondPassphraseItem);
      if (!this.wallet.isWatchOnly) { buttons.unshift(topWalletsItem); }
      if (!this.wallet.isWatchOnly) { buttons.unshift(delegatesItem); } // "Watch Only" address can't vote
      if (!this.wallet.isWatchOnly && !this.wallet.isDelegate) { buttons.unshift(delegateItem); }
      if (!this.wallet.isWatchOnly) { buttons.splice(buttons.length - 1, 0, backupItem); }

      if (this.wallet.isWatchOnly) {
        buttons.unshift({
          text: translation['WALLETS_PAGE.CONVERT_TO_FULL_WALLET'],
          role: 'label',
          icon: 'git-compare',
          handler: () => {
            this.navCtrl.navigateForward('/wallets/import', {
              queryParams: {
                address: this.wallet.address
              }
            });
          }
        });
      }

      const action = await this.actionSheetCtrl.create({buttons});

      action.present();
    });
  }

  presentWalletBackupPage() {
    this.onEnterPinCode = this.showBackup;
    this.pinCode.open('PIN_CODE.DEFAULT_MESSAGE', true);
  }

  private async showBackup(keys: WalletKeys) {
    if (!keys) { return; }

    const modal = await this.modalCtrl.create({
      component: WalletBackupModal,
      componentProps: {
        title: 'SETTINGS_PAGE.WALLET_BACKUP',
        keys,
      }
    });

    modal.present();
  }

  presentAddActionSheet() {
    this.translateService.get(['TRANSACTIONS_PAGE.SEND', 'TRANSACTIONS_PAGE.RECEIVE'])
      .subscribe(async (translation) => {
        const buttons: Array<object> = [
          {
            text: translation['TRANSACTIONS_PAGE.RECEIVE'],
            role: 'receive',
            icon: 'arrow-round-down',
            handler: () => {
              return this.openTransactionReceive();
            }
          }
        ];
        if (!this.wallet.isWatchOnly) {
          buttons.push({
            text: translation['TRANSACTIONS_PAGE.SEND'],
            role: 'send',
            icon: 'arrow-round-up',
            handler: () => {
              return this.navCtrl.navigateForward('/transaction/send');
            }
          });
        }

        const action = await this.actionSheetCtrl.create({
          buttons: buttons
        });

        action.present();
    });
  }

  openTransactionShow(tx: TransactionEntity) {
    this.navCtrl.navigateForward('/transaction/show', {
      queryParams: {
        transaction: JSON.stringify(tx),
        symbol: this.network.symbol,
        equivalentAmount: tx.amountEquivalent,
        equivalentSymbol: this.marketCurrency.symbol,
      }
    });
  }

  openTransactionReceive() {
    this.navCtrl.navigateForward('/transaction/receive', {
      queryParams: {
        address: this.address,
        token: this.network.token,
      }
    });
  }

  presentDelegatesModal() {
    this.navCtrl.navigateForward('/delegates');
  }

  async presentLabelModal() {
    const modal = await this.modalCtrl.create({
      component: SetLabelPage,
      componentProps: {
        label: this.wallet.label
      }
    });

    modal.onDidDismiss().then(({ data, role }) => {
      if (role === 'submit') {
        this.userDataProvider
          .setWalletLabel(this.wallet, data)
          .subscribe(null, error => this.toastProvider.error(error, 3000));
      }
    });

    modal.present();
  }

  async presentRegisterDelegateModal() {
    const modal = await this.modalCtrl.create({
      component: RegisterDelegatePage
    });

    modal.onDidDismiss().then(({ data }) => {
      if (lodash.isEmpty(name)) { return; }

      this.newDelegateName = data.name;
      this.newDelegateFee = data.fee;
      this.onEnterPinCode = this.createDelegate;
      this.pinCode.open('PIN_CODE.TYPE_PIN_SIGN_TRANSACTION', true, true);

    });

    modal.present();
  }

  async presentRegisterSecondPassphraseModal() {
    const modal = await this.modalCtrl.create({
      component: RegisterSecondPassphrasePage
    });

    modal.onDidDismiss().then(({ data }) => {
      if (lodash.isEmpty(data)) { return; }

      this.newSecondPassphrase = data;
      this.onEnterPinCode = this.createSignature;
      this.pinCode.open('PIN_CODE.TYPE_PIN_SIGN_TRANSACTION', true);

    });

    modal.present();
  }

  presentDeleteWalletConfirm() {
    this.translateService.get(
        ['ARE_YOU_SURE', 'CONFIRM', 'CANCEL', 'WALLETS_PAGE.REMOVE_WALLET_TEXT', 'WALLETS_PAGE.REMOVE_WATCH_ONLY_WALLET_TEXT'])
      .subscribe(async (translation) => {
        const confirm = await this.alertCtrl.create({
          header: translation.ARE_YOU_SURE,
          message: this.wallet.isWatchOnly ?
            translation['WALLETS_PAGE.REMOVE_WATCH_ONLY_WALLET_TEXT'] : translation['WALLETS_PAGE.REMOVE_WALLET_TEXT'],
          buttons: [
            {
              text: translation.CANCEL
            },
            {
              text: translation.CONFIRM,
              handler: () => {
                this.onEnterPinCode = this.deleteWallet;
                this.pinCode.open('PIN_CODE.TYPE_PIN_REMOVE_WALLET', false);
              }
            }
          ]
        });
        confirm.present();
    });
  }

  setWallet(wallet: Wallet) {
    this.wallet = wallet;
    const transactions = this.wallet.transactions.map((transaction) => ({
      id: transaction.id,
      timestamp: transaction.timestamp,
      recipientId: transaction.recipientId,
      amount: transaction.amount,
      fee: transaction.fee,
      type: transaction.type,
      vendorField: transaction.vendorField,
      senderId: transaction.senderId,
      confirmations: transaction.confirmations,
      isTransfer: transaction.isTransfer(),
      isSender: transaction.isSender(),
      appropriateAddress: transaction.getAppropriateAddress(),
      activityLabel: transaction.getActivityLabel(),
      typeLabel: transaction.getTypeLabel(),
      totalAmount: transaction.getAmount(),
      date: transaction.date,
      amountEquivalent: transaction.getAmountEquivalent(this.marketCurrency, this.marketHistory)
    }));

    if (dequal(transactions, this.transactions)) {
      return;
    }

    this.transactions = transactions;
  }

  presentTopWalletsModal() {
    this.navCtrl.navigateForward('/wallets/top');
  }

  private createDelegate(keys: WalletKeys) {
    const publicKey = this.wallet.publicKey || PrivateKey.fromSeed(keys.key).getPublicKey().toHex();

    const transaction = <TransactionDelegate>{
      passphrase: keys.key,
      secondPassphrase: keys.secondKey,
      username: this.newDelegateName,
      fee: this.newDelegateFee,
      publicKey
    };

    this.arkApiProvider.transactionBuilder.createDelegate(transaction)
      .pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe((data) => {
        this.confirmTransaction.open(data, keys);
      });
  }

  private onTransactionConfirm = (tx: Transaction): void =>  {
    switch (tx.type) {
      case TransactionType.CreateDelegate:
        const userName = tx.asset && tx.asset['delegate'] ? tx.asset['delegate'].username : null;
        this.userDataProvider.ensureWalletDelegateProperties(this.wallet, userName);
        break;
    }
  };

  private createSignature(keys: WalletKeys) {
    keys.secondPassphrase = this.newSecondPassphrase;

    this.arkApiProvider.transactionBuilder
      .createSignature(keys.key, keys.secondPassphrase)
      .pipe(
        takeUntil(this.unsubscriber$)
      )
      .subscribe((data) => {
        this.confirmTransaction.open(data, keys);
      });
  }

  private saveWallet() {
    this.userDataProvider.updateWallet(this.wallet, this.profile.profileId);
  }

  private deleteWallet() {
      this.userDataProvider.removeWalletByAddress(this.wallet.address);
      this.navCtrl.navigateRoot('/wallets');
  }

  private refreshTransactions(save: boolean = true, loader?: any) {
    this.zone.runOutsideAngular(() => {
      this.arkApiProvider.client.getTransactionList(this.address)
      .pipe(
        finalize(() => {
          if (loader) {
            if (loader.type === "ionRefresh") {
              this.refresher.complete();
            } else {
              loader.dismiss();
            }
          }
          this.emptyTransactions = lodash.isEmpty(this.wallet.transactions);
        }),
        takeUntil(this.unsubscriber$)
      )
      .subscribe((response) => {
        if (response && response.success) {
          this.wallet.loadTransactions(response.transactions, this.arkApiProvider.network);
          this.setWallet(this.wallet);
          this.wallet.lastUpdate = new Date().getTime();
          this.wallet.isCold = lodash.isEmpty(response.transactions);
          if (save) { this.saveWallet(); }
        }
      });
    });
  }

  private refreshPrice() {
    this.marketDataProvider.refreshTicker();
  }

  private refreshAccount() {
    this.arkApiProvider.client.getWallet(this.address).pipe(
      takeUntil(this.unsubscriber$)
    ).subscribe((response) => {
      this.wallet.deserialize(response);
      this.saveWallet();
      if (this.wallet.isDelegate) {
        return;
      }

      this.arkApiProvider
          .getDelegateByPublicKey(this.wallet.publicKey)
          .subscribe(delegate => this.userDataProvider.ensureWalletDelegateProperties(this.wallet, delegate));
    });
  }

  private refreshAllData() {
    this.refreshAccount();
    this.refreshTransactions();
  }

  private onUpdateMarket() {
    this.marketDataProvider.onUpdateTicker$.pipe(
      takeUntil(this.unsubscriber$)
    ).subscribe((ticker) => this.setTicker(ticker));
  }

  private setTicker(ticker) {
    this.ticker = ticker;
    this.settingsDataProvider.settings.subscribe((settings) => {
      this.marketCurrency = this.ticker.getCurrency({ code: settings.currency });
    });
  }

  private onUpdateWallet() {
    this.userDataProvider.onUpdateWallet$
      .pipe(
        takeUntil(this.unsubscriber$),
        debounceTime(500)
      )
      .subscribe((wallet) => {
        if (!lodash.isEmpty(wallet) && this.wallet.address === wallet.address) { this.setWallet(wallet); }
      });
  }

  private load() {

    this.arkApiProvider.fees.subscribe((fees) => this.fees = fees);
    if (this.marketDataProvider.cachedTicker) {
      this.setTicker(this.marketDataProvider.cachedTicker);
    }
    this.marketDataProvider.history.subscribe((history) => this.marketHistory = history);

    if (lodash.isEmpty(this.wallet)) {
      this.navCtrl.pop();
      return;
    }

    this.userDataProvider.setCurrentWallet(this.wallet);

    const transactions = this.wallet.transactions;
    this.emptyTransactions = lodash.isEmpty(transactions);

    // search for new transactions immediately
    if (this.emptyTransactions && !this.wallet.isCold) {
      this.translateService
        .get('TRANSACTIONS_PAGE.FETCHING_TRANSACTIONS')
        .pipe(
          takeUntil(this.unsubscriber$)
        )
        .subscribe(async (translation) => {
          const loader = await this.loadingCtrl.create({
            message: `${translation}...`,
          });

          loader.present();

          this.refreshTransactions(true, loader);
        });
    }
  }

  ngOnInit(): void {
    this.confirmTransaction.onConfirm.pipe(
      takeUntil(this.unsubscriber$)
    ).subscribe(this.onTransactionConfirm);
    this.load();
    this.refreshAllData();
    this.refreshPrice();
    this.onUpdateWallet();
    this.onUpdateMarket();
    // this.content.resize();

    this.refreshDataIntervalListener = setInterval(() => this.refreshAllData(), constants.WALLET_REFRESH_TRANSACTIONS_MILLISECONDS);
    this.refreshTickerIntervalListener = setInterval(() => this.refreshPrice(), constants.WALLET_REFRESH_PRICE_MILLISECONDS);
  }

  ngOnDestroy() {
    clearInterval(this.refreshDataIntervalListener);
    clearInterval(this.refreshTickerIntervalListener);

    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
