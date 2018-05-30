import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { UserDataProvider } from '@providers/user-data/user-data';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { ToastProvider } from '@providers/toast/toast';

import { NetworkProvider } from '@providers/network/network';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';
import { BaseWalletImport } from '@root/src/pages/wallet/wallet-import/wallet-import.base';

import { FormBuilder, FormGroup } from '@angular/forms';
import { PassphraseValidator } from '@root/src/validators/passphrase/passphrase';
import { AddressValidator } from '@root/src/validators/address/address';

import * as constants from '@app/app.constants';

@IonicPage()
@Component({
  selector: 'page-wallet-import-passphrase',
  templateUrl: 'wallet-import-manual.html',
  providers: [InAppBrowser, AddressValidator]
})
export class WalletManualImportPage extends BaseWalletImport  {

  public addressOrPassphrase: string;
  public useAddress: boolean;
  public nonBIP39Passphrase: boolean;
  public wordSuggestions = [];
  public manualImportFormGroup: FormGroup;
  @ViewChild('inputAddressOrPassphrase') inputAddressOrPassphrase;

  constructor(
    navParams: NavParams,
    navCtrl: NavController,
    userDataProvider: UserDataProvider,
    arkApiProvider: ArkApiProvider,
    toastProvider: ToastProvider,
    modalCtrl: ModalController,
    networkProvider: NetworkProvider,
    private inAppBrowser: InAppBrowser,
    private formBuilder: FormBuilder,
    private addressValidator: AddressValidator,
    settingsDataProvider: SettingsDataProvider) {
    super(navParams, navCtrl, userDataProvider, arkApiProvider, toastProvider, modalCtrl, networkProvider, settingsDataProvider);
    this.useAddress = navParams.get('type') === 'address';
    this.nonBIP39Passphrase = false;

    this.initFormValidation();
  }

  submitForm() {
    this.import(this.useAddress ? this.addressOrPassphrase : null,
                this.useAddress ? null : this.addressOrPassphrase,
                !this.nonBIP39Passphrase);
  }

  initFormValidation() {
    const validatorAddressFct = this.useAddress ? this.addressValidator.isValid.bind(this.addressValidator) : null;
    const validatorGroupFct = this.useAddress ? {} : { validator: PassphraseValidator.isValid };
    // We use form group validator for passphrase validation as we need the 'nonBIP39Passphrase' bool value and the passphrase value

    this.manualImportFormGroup = this.formBuilder.group({
      controlAddressOrPassphrase: ['', validatorAddressFct],
      controlNonBIP39: ['']
    }, validatorGroupFct);
  }

  openBIP39DocURL() {
    return this.inAppBrowser.create(constants.BIP39_DOCUMENTATION_URL, '_system');
  }

  addressOrPassphraseChange(value) {
    const lastAddressOrPassphrase = this.addressOrPassphrase || '';
    this.addressOrPassphrase = value;

    this.suggestWord(lastAddressOrPassphrase, this.addressOrPassphrase);
  }

  suggestWord(lastPassphrase, passphrase) {
    this.wordSuggestions = [];

    if (this.useAddress || this.nonBIP39Passphrase || !passphrase) { return; }

    const wordsLastPassphrase = lastPassphrase.split(' ');
    const wordsPassphrase = passphrase.split(' ');
    if (wordsLastPassphrase.length !== wordsPassphrase.length) { return; }
    // don't do anything if we type 1st letter of a new word or if we remove one word

    const lastWordLastPassphrase = wordsLastPassphrase.pop();
    const lastWordPassphrase = wordsPassphrase.pop();
    if (wordsLastPassphrase.join() !== wordsPassphrase.join()) { return; } // we only want the last word to change

    if (Math.abs(lastWordLastPassphrase.length - lastWordPassphrase.length) === 1 && lastWordPassphrase.length > 1 &&
        (lastWordLastPassphrase.indexOf(lastWordPassphrase) !== -1 || lastWordPassphrase.indexOf(lastWordLastPassphrase) !== -1 )) {
      // we just want one letter to be different - only "manual" typing, don't suggest on copy/paste stuff
      const bip39 = require('bip39');
      const englishWordlist = bip39.wordlists.english;
      this.wordSuggestions = englishWordlist.filter( word => word.indexOf(lastWordPassphrase) === 0 );
    }
  }

  suggestionClick(index) {
    const wordsPassphrase = this.addressOrPassphrase.split(' ');
    wordsPassphrase[wordsPassphrase.length - 1] = this.wordSuggestions[index];
    this.addressOrPassphrase = wordsPassphrase.join(' ');

    this.wordSuggestions = [];
    this.inputAddressOrPassphrase.setFocus();
  }
}
