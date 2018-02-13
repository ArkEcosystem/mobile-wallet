import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { Contact, Wallet, MarketTicker, MarketCurrency, SendTransactionForm, WalletKeys } from '@models/model';

import { UserDataProvider } from '@providers/user-data/user-data';
import { MarketDataProvider } from '@providers/market-data/market-data';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { ToastProvider } from '@providers/toast/toast';

import { ContactsAutoCompleteService } from '@providers/auto-complete/contacts-service';

import { PublicKey } from 'ark-ts/core';
import { Network, Fees } from 'ark-ts/model';

import { UnitsSatoshiPipe } from '@pipes/units-satoshi/units-satoshi';
import { PinCodeComponent } from '@components/pin-code/pin-code';
import { ConfirmTransactionComponent } from '@components/confirm-transaction/confirm-transaction';
import { QRScannerComponent } from '@components/qr-scanner/qr-scanner';
import * as constants from '@app/app.constants';
import { TransactionSend } from 'ark-ts';

import { AutoCompleteComponent } from 'ionic2-auto-complete';
import { AutoCompleteContact } from '@models/contact';
import { TranslatableObject } from '@models/translate';
import { QRCodeScheme } from '@models/model';
import { BigNumber } from 'bignumber.js';
import { ArkUtility } from '../../../utils/ark-utility';

@IonicPage()
@Component({
  selector: 'page-transaction-send',
  templateUrl: 'transaction-send.html',
  providers: [UnitsSatoshiPipe],
})
export class TransactionSendPage implements OnInit {
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
  isExistingContact = true;
  isRecipientNameAutoSet: boolean;

  tokenPlaceholder = 100;
  fiatPlaceholder: number;

  private currentAutoCompleteFieldValue: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
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
  }

  sendAll() {
    const balance = Number(this.currentWallet.balance);
    const sendableAmount = balance - this.fees.send;
    if (sendableAmount <= 0) {
      this.toastProvider.error({
          key: 'API.BALANCE_TOO_LOW_DETAIL',
          parameters: {
            token: this.currentNetwork.token,
            fee: ArkUtility.arktoshiToArk(this.fees.send),
            amount: ArkUtility.arktoshiToArk(balance),
            totalAmount: ArkUtility.arktoshiToArk(balance + this.fees.send),
            balance: ArkUtility.arktoshiToArk(balance)
          }
        } as TranslatableObject,
        10000);
      return;
    }

    this.transaction.amount = this.unitsSatoshiPipe.transform(sendableAmount, true);
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

  public onSearchItem(contact: AutoCompleteContact): void {
    if (!contact || !contact.address) {
      return;
    }

    this.transaction.recipientAddress = contact.address;
    this.currentAutoCompleteFieldValue = contact.name;
    this.isRecipientNameAutoSet = true;

    // if we have a real contact or a wallet with a label, we don't show the field to add a new contact
    if (contact.name !== contact.address) {
      this.isExistingContact = true;
      this.transaction.recipientName = contact.name;
    } else {
      this.isExistingContact = false;
      this.transaction.recipientName = null;
    }
  }

  public onSearchInput(input: string): void {
    // this check is needed because clicking into the field, also triggers this method
    // an then the recipientName is set to null, even though nothing has changed
    if (input === this.currentAutoCompleteFieldValue) {
      return;
    }

    if (this.isRecipientNameAutoSet) {
      this.transaction.recipientName = null;
    }

    this.isExistingContact = false;
    this.currentAutoCompleteFieldValue = input;
    this.transaction.recipientAddress = input;
  }

  private validAddress(): boolean {
    const isValid = PublicKey.validateAddress(this.transaction.recipientAddress, this.currentNetwork);
    this.sendTransactionHTMLForm.form.controls['recipientAddress'].setErrors({ incorrect: !isValid });

    return isValid;
  }

  private validForm(): boolean {
    let isValid: boolean;
    for (const name in this.sendTransactionHTMLForm.form.controls) {
      if (name === 'recipientAddress') {
        continue;
      }
      const control = this.sendTransactionHTMLForm.form.controls[name];
      isValid = control.valid;
      if (!isValid) {
        break;
      }
    }

    return isValid;
  }

  createContact() {
    if (this.isExistingContact || !this.transaction.recipientName) {
      return;
    }

    const validAddress = this.validAddress();
    let validName = !!this.transaction.recipientName;
    if (validName) {
      validName = new RegExp('^[a-zA-Z0-9]+[a-zA-Z0-9- ]+$').test(this.transaction.recipientName);
    }
    if (validAddress && validName) {
      const contact = new Contact();
      contact.name = this.transaction.recipientName;
      this.userDataProvider.addContact(this.transaction.recipientAddress, contact);
    }
  }

  scanQRCode() {
    this.qrScanner.open(true);
  }

  onInputToken() {
    const precision = this.marketCurrency.code === 'btc' ? 8 : 2;
    this.transaction.amountEquivalent = +(this.transaction.amount * this.marketCurrency.price).toFixed(precision);
  }

  onInputFiat() {
    this.transaction.amount = +(this.transaction.amountEquivalent / this.marketCurrency.price).toFixed(8);
  }

  onEnterPinCode(keys: WalletKeys) {
    const amount = new BigNumber(this.transaction.amount);
    const data: TransactionSend = {
      amount: amount.times(constants.WALLET_UNIT_TO_SATOSHI).toNumber(),
      vendorField: this.transaction.smartBridge,
      passphrase: keys.key,
      secondPassphrase: keys.secondKey,
      recipientId: this.transaction.recipientAddress,
    };

    this.arkApiProvider.api.transaction.createTransaction(data).subscribe((transaction) => {
      this.confirmTransaction.open(transaction, keys);
    }, () => {
      this.toastProvider.error('TRANSACTIONS_PAGE.CREATE_TRANSACTION_ERROR');
    });
  }

  onScanQRCode(qrCode: QRCodeScheme) {
    if (qrCode.address) {
      this.setFormValuesFromAddress(qrCode.address);
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
      });
    });
  }

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

    this.setFormValuesFromAddress(this.navParams.get('address') || '');
  }

  private setFormValuesFromAddress(address: string): void {
    this.transaction.recipientAddress = address;
    this.sendForm.patchValue({recipientAddress: address});
    this.isRecipientNameAutoSet = true;

    const contact: Contact = this.userDataProvider.getContactByAddress(address);
    if (contact) {
      this.isExistingContact = true;
      this.transaction.recipientName = contact.name;
    } else {
      this.isExistingContact = false;
      this.transaction.recipientName = null;
    }
  }
}
