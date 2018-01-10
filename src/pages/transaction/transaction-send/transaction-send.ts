import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Config } from 'ionic-angular';
import { FormGroup, Validators, FormControl } from '@angular/forms'

import { Contact, Wallet, MarketTicker, MarketCurrency, Transaction, SendTransactionForm, WalletKeys } from '@models/model';

import { UserDataProvider } from '@providers/user-data/user-data';
import { MarketDataProvider } from '@providers/market-data/market-data';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { ToastProvider } from '@providers/toast/toast';

import { ContactsAutoCompleteService } from '@providers/auto-complete/contacts-service';

import { PublicKey } from 'ark-ts/core';
import { Network, Fees } from 'ark-ts/model';

import { UnitsSatoshiPipe } from '@pipes/units-satoshi/units-satoshi';
import lodash from 'lodash';
import { PinCodeComponent } from '@components/pin-code/pin-code';
import { ConfirmTransactionComponent } from '@components/confirm-transaction/confirm-transaction';
import { QRScannerComponent } from '@components/qr-scanner/qr-scanner';
import * as constants from '@app/app.constants';
import { PrivateKey, TransactionSend } from 'ark-ts';

import { AutoCompleteComponent } from 'ionic2-auto-complete';
import { BigNumber } from 'bignumber.js';

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
  @ViewChild('searchBar') searchBar: AutoCompleteComponent;

  sendForm: FormGroup;
  transaction: SendTransactionForm = {};

  currentWallet: Wallet;
  currentNetwork: Network;
  marketTicker: MarketTicker;
  marketCurrency: MarketCurrency;
  fees: Fees;
  contact: object;

  tokenPlaceholder: number = 100;
  fiatPlaceholder: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private config: Config,
    private userDataProvider: UserDataProvider,
    private arkApiProvider: ArkApiProvider,
    private marketDataProvider: MarketDataProvider,
    private settingsDataProvider: SettingsDataProvider,
    private toastProvider: ToastProvider,
    public contactsAutoCompleteService: ContactsAutoCompleteService,
    private unitsSatoshiPipe: UnitsSatoshiPipe,
  ) {
    this.currentWallet = this.userDataProvider.currentWallet;
    this.currentNetwork = this.userDataProvider.currentNetwork;
    // this.config.set('android', 'scrollPadding', true);
  }

  sendAll() {
    let balance = Number(this.currentWallet.balance);
    if (balance === 0) return;

    this.transaction.amount = this.unitsSatoshiPipe.transform(balance - this.fees.send);
    this.onInputToken();
  }

  send() {
    if (!this.validForm()) {
      this.toastProvider.error('TRANSACTIONS_PAGE.INVALID_FORM_ERROR');
    } else if (!this.validAddress()) {
      this.toastProvider.error('TRANSACTIONS_PAGE.INVALID_ADDRESS_ERROR');
    } else {
      this.createContact();
      this.pinCode.open('PIN_CODE.TYPE_PIN_SIGN_TRANSACTION', true);
    }
  }

  onSearchItem(recipient) {
    if (recipient && recipient['address']) {
      this.contact = recipient;
      this.transaction.recipientAddress = recipient['address'];
    }
  }

  onSearchInput(input) {
    this.contact = null;
    this.transaction.recipientAddress = input;
  }

  private validAddress(): boolean {
    if (this.contact) {
      return true;
    }

    let isValid = PublicKey.validateAddress(this.transaction.recipientAddress, this.currentNetwork);
    this.sendTransactionHTMLForm.form.controls['recipientAddress'].setErrors({ incorret: !isValid });

    return isValid;
  }

  private validForm(): boolean {
    let isValid = true;
    for (let name in this.sendTransactionHTMLForm.form.controls) {
      if (name === 'recipientAddress') {
        continue;
      }
      let control = this.sendTransactionHTMLForm.form.controls[name];
      isValid = control.valid;
      if (!isValid) {
        break;
      }
    }

    return isValid;
  }

  createContact(saveContactIfValid: boolean = false) {
    if (this.contact) {
      return;
    }

    let validAddress = this.validAddress();
    let validName = !!this.transaction.recipientName;
    if (validName) {
      validName = new RegExp('^[a-zA-Z0-9]+[a-zA-Z0-9- ]+$').test(this.transaction.recipientName);
    }
    if (validAddress && validName) {
      let contact = new Contact();
      contact.name = this.transaction.recipientName;
      this.userDataProvider.addContact(this.transaction.recipientAddress, contact);
    }
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
    let amount = new BigNumber(this.transaction.amount)
    let data: TransactionSend = {
      amount: amount.times(constants.WALLET_UNIT_TO_SATOSHI).toNumber(),
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
      this.contact = null;
      this.transaction.recipientAddress = qrCode['a'];
      this.searchBar.inputElem.value = qrCode['a'];
    } else {
      this.toastProvider.error('QR_CODE.INVALID_QR_ERROR');
    }
  }

  ionViewDidLoad() {
    this.arkApiProvider.fees.subscribe((fees) => this.fees = fees);
    this.marketDataProvider.ticker.subscribe((ticker) => {
      this.marketTicker = ticker;

      this.settingsDataProvider.settings.subscribe((settings) => {
        this.marketCurrency = ticker.getCurrency({ code: settings.currency });
        this.fiatPlaceholder = +(this.tokenPlaceholder * this.marketCurrency.price).toFixed(2);
      })
    })
  }

  // ngOnDestroy() {
  //   this.config.set('android', 'scrollPadding', false);
  // }

  ngOnInit(): void {
    this.sendForm = new FormGroup({
      recipientAddress: new FormControl(''),
      recipientName: new FormControl(''),
      amount: new FormControl('', [
        Validators.required
      ]),
      amountEquivalent: new FormControl(''),
      smartBridge: new FormControl('')
    });

    let address = this.navParams.get('address') || '';
    this.contact = this.userDataProvider.getContactByAddress(address);

    this.sendForm.patchValue({
      recipientAddress: address,
    })
  }

}
