import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Contact, Wallet, MarketTicker, MarketCurrency, Transaction, SendTransactionForm, WalletKeys } from '@models/model';

import { UserDataProvider } from '@providers/user-data/user-data';
import { MarketDataProvider } from '@providers/market-data/market-data';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { ToastProvider } from '@providers/toast/toast';

import { PublicKey } from 'ark-ts/core';
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
  @ViewChild('sendTransactionForm') sendTransactionHTMLForm: HTMLFormElement;
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
    if (!this.showAddContact || this.validContact(true)) {
      this.pinCode.open('PIN_CODE.TYPE_PIN_SIGN_TRANSACTION', true);
    } else if (this.showAddContact) {
      this.toastProvider.error('TRANSACTIONS_PAGE.INVALID_CONTACT_ERROR');
    }
  }

  selectContact(recipient) {
    this.showAddContact = lodash.isUndefined(recipient);

    this.transaction.recipientAddress = recipient;
  }

  validContact(saveContactIfValid: boolean = false) {
    if (!this.showAddContact) {
      return true;
    }
    let validAddress = PublicKey.validateAddress(this.transaction.recipientAddress, this.currentNetwork);
    let validName = new RegExp('^[a-zA-Z0-9 ]+$').test(this.transaction.recipientName);
    this.sendTransactionHTMLForm.form.controls['recipientAddress'].setErrors({ incorret: !validAddress });
    this.sendTransactionHTMLForm.form.controls['recipientName'].setErrors({ incorret: !validName });
    if (saveContactIfValid && validAddress && validName) {
      let contact = new Contact();
      contact.name = this.transaction.recipientName;
      this.userDataProvider.addContact(this.transaction.recipientAddress, contact);
    }

    return validAddress && validName;
  }

  scanQRCode() {
    this.qrScanner.open();
  }

  onInputToken() {
    let precision = this.marketCurrency.code === 'btc' ? 8 : 2;
    this.transaction.amountEquivalent = +(this.transaction.amount * this.marketCurrency.price).toFixed(precision);
  }

  onInputFiat() {
    this.transaction.amount = +(this.transaction.amountEquivalent / this.marketCurrency.price).toFixed(8);
  }

  onEnterPinCode(keys: WalletKeys) {
    let data: TransactionSend = {
      amount: Number(this.transaction.amount) * constants.WALLET_UNIT_TO_SATOSHI,
      vendorField: this.transaction.smartBridge,
      passphrase: keys.key,
      secondPassphrase: keys.secondKey,
      recipientId: this.transaction.recipientAddress,
    };

    this.arkApiProvider.api.transaction.createTransaction(data).subscribe((transaction) => {
      this.confirmTransaction.open(transaction, keys);
    }, (error) => {
      this.toastProvider.error('TRANSACTIONS_PAGE.CREATE_TRANSACTION_ERROR');
    });
  }

  onScanQRCode(qrCode: object) {
    if (qrCode['a']) {
      this.transaction.recipientAddress = qrCode['a'];
      this.validContact();
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
