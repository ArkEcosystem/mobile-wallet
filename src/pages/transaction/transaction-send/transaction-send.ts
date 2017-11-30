import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Wallet, MarketTicker, MarketCurrency, Transaction, SendTransactionForm, WalletKeys } from '@models/model';

import { UserDataProvider } from '@providers/user-data/user-data';
import { MarketDataProvider } from '@providers/market-data/market-data';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { ToastProvider } from '@providers/toast/toast';

import { Network, Fees } from 'ark-ts/model';

import { UnitsSatoshiPipe } from '@pipes/units-satoshi/units-satoshi';
import lodash from 'lodash';
import { PinCodeComponent } from '@components/pin-code/pin-code';
import { ConfirmTransactionComponent } from '@components/confirm-transaction/confirm-transaction';
import { QRScannerComponent } from '@components/qr-scanner/qr-scanner';
import * as constants from '@app/app.constants';
import { PrivateKey, TransactionSend } from 'ark-ts';

@IonicPage()
@Component({
  selector: 'page-transaction-send',
  templateUrl: 'transaction-send.html',
  providers: [UnitsSatoshiPipe],
})
export class TransactionSendPage {
  @ViewChild('pinCode') pinCode: PinCodeComponent;
  @ViewChild('confirmTransaction') confirmTransaction: ConfirmTransactionComponent;
  @ViewChild('qrScanner') qrScanner: QRScannerComponent;

  transaction: SendTransactionForm = {};

  currentWallet: Wallet;
  currentNetwork: Network;
  marketTicker: MarketTicker;
  marketCurrency: MarketCurrency;
  fees: Fees;

  showAddContact: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userDataProvider: UserDataProvider,
    private arkApiProvider: ArkApiProvider,
    private marketDataProvider: MarketDataProvider,
    private settingsDataProvider: SettingsDataProvider,
    private toastProvider: ToastProvider,
    private unitsSatoshiPipe: UnitsSatoshiPipe,
  ) {
    this.currentWallet = this.userDataProvider.currentWallet;
    this.currentNetwork = this.userDataProvider.currentNetwork;
  }

  sendAll() {
    let balance = Number(this.currentWallet.balance);
    if (balance === 0) return;

    this.transaction.amount = this.unitsSatoshiPipe.transform(balance - this.fees.send);
    this.onInputToken();
  }

  send() {
    this.pinCode.open('PIN_CODE.TYPE_PIN_SIGN_TRANSACTION', true);
  }

  selectContact(recipient) {
    this.showAddContact = lodash.isUndefined(recipient);

    this.transaction.recipientAddress = recipient;
  }

  scanQRCode() {
    this.qrScanner.open();
  }

  onInputToken() {
    this.transaction.amountEquivalent= this.transaction.amount * this.marketCurrency.price;
  }

  onInputFiat() {
    this.transaction.amount = this.transaction.amountEquivalent / this.marketCurrency.price;
  }

  onEnterPinCode(keys: WalletKeys) {
    let data: TransactionSend = {
      amount: Number(this.transaction.amount) * constants.WALLET_UNIT_TO_SATOSHI,
      vendorField: this.transaction.smartBridge,
      passphrase: PrivateKey.fromWIF(keys.key, this.currentNetwork),
      recipientId: this.transaction.recipientAddress,
    };

    if (keys.secondKey) data.secondPassphrase = PrivateKey.fromWIF(keys.secondKey);

    this.arkApiProvider.api.transaction.createTransaction(data).subscribe((transaction) => {
      this.confirmTransaction.open(transaction, keys);
    }, (error) => {
      this.toastProvider.error('TRANSACTIONS_PAGE.CREATE_TRANSACTION_ERROR');
    });
  }

  onScanQRCode(qrCode: object) {
    if (qrCode['a']) {
      this.transaction.recipientAddress = qrCode['a'];
    }
  }

  ionViewDidLoad() {
    this.arkApiProvider.fees.subscribe((fees) => this.fees = fees);
    this.marketDataProvider.ticker.subscribe((ticker) => {
      this.marketTicker = ticker;

      this.settingsDataProvider.settings.subscribe((settings) => {
        this.marketCurrency = ticker.getCurrency({ code: settings.currency });
      })
    })
  }

}
