import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { Contact, Wallet, SendTransactionForm, WalletKeys } from '@models/model';

import { UserDataProvider } from '@providers/user-data/user-data';
import { ContactsProvider } from '@providers/contacts/contacts';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { ToastProvider } from '@providers/toast/toast';

import { ContactsAutoCompleteService } from '@providers/contacts-auto-complete/contacts-auto-complete';

import { PublicKey } from 'ark-ts/core';
import { Network, Fees } from 'ark-ts/model';

import { TruncateMiddlePipe } from '@pipes/truncate-middle/truncate-middle';
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
import { AddressCheckerProvider} from '@providers/address-checker/address-checker';
import { AddressCheckResult } from '@providers/address-checker/address-check-result';
import { AmountComponent } from '@components/amount/amount';
import { Amount } from '@components/amount/amount.model';

interface CombinedResult {
  checkerDone: boolean;
  checkerResult: AddressCheckResult;
  pinCodeDone: boolean;
  keys: WalletKeys;
}

@IonicPage()
@Component({
  selector: 'page-transaction-send',
  templateUrl: 'transaction-send.html',
  providers: [UnitsSatoshiPipe, TruncateMiddlePipe],
})
export class TransactionSendPage implements OnInit {
  @ViewChild('sendTransactionForm') sendTransactionHTMLForm: HTMLFormElement;
  @ViewChild('pinCode') pinCode: PinCodeComponent;
  @ViewChild('confirmTransaction') confirmTransaction: ConfirmTransactionComponent;
  @ViewChild('qrScanner') qrScanner: QRScannerComponent;
  @ViewChild('searchBar') searchBar: AutoCompleteComponent;
  @ViewChild(AmountComponent) private amountComponent: AmountComponent;

  sendForm: FormGroup;
  transaction: SendTransactionForm = {};

  currentWallet: Wallet;
  currentNetwork: Network;
  fees: Fees;
  isExistingContact = true;
  isRecipientNameAutoSet: boolean;

  private currentAutoCompleteFieldValue: string;

  constructor(
    private navParams: NavParams,
    private userDataProvider: UserDataProvider,
    private contactsProvider: ContactsProvider,
    private arkApiProvider: ArkApiProvider,
    private toastProvider: ToastProvider,
    public contactsAutoCompleteService: ContactsAutoCompleteService,
    private unitsSatoshiPipe: UnitsSatoshiPipe,
    private truncateMiddlePipe: TruncateMiddlePipe,
    private addressChecker: AddressCheckerProvider
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
    this.amountComponent.setAmount(this.transaction.amount);
  }

  send() {
    if (!this.validForm()) {
      this.toastProvider.error('TRANSACTIONS_PAGE.INVALID_FORM_ERROR');
    } else if (!this.validAddress()) {
      this.toastProvider.error('TRANSACTIONS_PAGE.INVALID_ADDRESS_ERROR');
    } else {
      this.createContact();

      const combinedResult: CombinedResult = {checkerDone: false, checkerResult: null, pinCodeDone: false, keys: null};
      this.addressChecker.checkAddress(this.transaction.recipientAddress).subscribe(checkerResult => {
        combinedResult.checkerDone = true;
        combinedResult.checkerResult = checkerResult;
        this.createTransactionAndShowConfirm(combinedResult);
      });
      this.pinCode.open('PIN_CODE.TYPE_PIN_SIGN_TRANSACTION', true, true, (keys: WalletKeys) => {
        combinedResult.pinCodeDone = true;
        combinedResult.keys = keys;
        this.createTransactionAndShowConfirm(combinedResult);
      });
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
    // and then the recipientName is set to null, even though nothing has changed
    if (input === this.currentAutoCompleteFieldValue) {
      return;
    }

    this.setRecipientByAddress(input);
  }

  public showFullAddress(): void {
    // When field has focus, show full address
    this.searchBar.setValue(this.transaction.recipientAddress);
  }

  public truncateAddressMiddle(): void {
    // When field loses focus, use ellipses to show beginning and end of address
    const addressString = this.transaction.recipientAddress;
    this.searchBar.setValue(this.truncateMiddlePipe.transform(addressString, constants.TRANSACTION_ADDRESS_SIZE, addressString));
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
      this.contactsProvider.addContact(this.transaction.recipientName, this.transaction.recipientAddress);
    }
  }

  scanQRCode() {
    this.qrScanner.open(true);
  }


  private createTransactionAndShowConfirm(result: CombinedResult) {
    if (!result.checkerDone || !result.pinCodeDone) {
      return;
    }

    const amount = new BigNumber(this.transaction.amount);
    const data: TransactionSend = {
      amount: amount.times(constants.WALLET_UNIT_TO_SATOSHI).toNumber(),
      vendorField: this.transaction.smartBridge,
      passphrase: result.keys.key,
      secondPassphrase: result.keys.secondKey,
      recipientId: this.transaction.recipientAddress,
    };

    this.arkApiProvider.api.transaction.createTransaction(data).subscribe((transaction) => {
      this.confirmTransaction.open(transaction, result.keys, result.checkerResult);
    }, () => {
      this.toastProvider.error('TRANSACTIONS_PAGE.CREATE_TRANSACTION_ERROR');
    });
  }

  onScanQRCode(qrCode: QRCodeScheme) {
    if (qrCode.address) {
      this.setFormValuesFromAddress(qrCode.address);
      this.truncateAddressMiddle();
    } else {
      this.toastProvider.error('QR_CODE.INVALID_QR_ERROR');
    }
  }

  ionViewDidLoad() {
    this.arkApiProvider.fees.subscribe((fees) => this.fees = fees);
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

  public onAmountChange(newAmounts: Amount) {
    this.transaction.amount = newAmounts.amount;
    this.transaction.amountEquivalent = newAmounts.amountEquivalent;
  }

  private setFormValuesFromAddress(address: string): void {
    if (!address) {
      return;
    }

    this.sendForm.patchValue({recipientAddress: address});
    this.setRecipientByAddress(address);
  }

  private setRecipientByAddress(input: string): void {
    if (input.indexOf('...') === -1) { // Don't set our shortened '...' address as actual address
    this.currentAutoCompleteFieldValue = input;
    this.transaction.recipientAddress = input;

    const contactOrLabel: Contact | string = this.contactsProvider.getContactByAddress(input)
                                             || this.userDataProvider.getWalletLabel(input);
    if (contactOrLabel && contactOrLabel !== input) {
      this.isExistingContact = true;
      this.isRecipientNameAutoSet = true;
      this.transaction.recipientName = typeof contactOrLabel === 'string' ? contactOrLabel : contactOrLabel.name;
    } else {
      this.isExistingContact = false;
      if (this.isRecipientNameAutoSet) {
        this.transaction.recipientName = null;
      }
    }
  }
}
}
