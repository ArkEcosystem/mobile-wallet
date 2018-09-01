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
import bip39 from 'bip39';

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
  public hidePassphrase = false;
  public passphraseHidden: string;
  public manualImportFormGroup: FormGroup;

  private wordlist;
  private suggestLanguageFound = false;

  @ViewChild('inputAddressOrPassphrase') inputAddressOrPassphrase;
  @ViewChild('inputPassphraseHidden') inputPassphraseHidden;

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

    this.wordlist = bip39.wordlists.english;
    if (this.wordlistLanguage && this.wordlistLanguage !== 'english') {
      this.wordlist = bip39.wordlists[this.wordlistLanguage].concat(this.wordlist);
      // at first, we use the english wordlist *and* the configured wordlist language (suggesting in the 2 languages)
    }

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
    this.updatePassphraseHidden();

    if (!this.useAddress && !this.nonBIP39Passphrase && this.addressOrPassphrase) {
      this.updateWordlist();
      this.suggestWord(lastAddressOrPassphrase, this.addressOrPassphrase);
    }
  }

  updateWordlist() {
    // Here we want to find in which language we have to suggest words based on the words already typed
    // Only applicable if we configured a passphrase language != english
    const words = this.addressOrPassphrase.split(' ');
    if (this.suggestLanguageFound || !this.wordlistLanguage || this.wordlistLanguage === 'english' || words.length < 2) { return; }

    for (const word of words.slice(0, -1)) {
      // we use every word except the last one as it may being typed
      for (const [lang1, lang2] of [['english', this.wordlistLanguage], [this.wordlistLanguage, 'english']]) {
        // we want to find a word which is in one wordlist and not in the other
        if (bip39.wordlists[lang1].indexOf(word) !== -1 && bip39.wordlists[lang2].indexOf(word) === -1) {
          this.wordlist = bip39.wordlists[lang1];
          this.suggestLanguageFound = true;
          return;
        }
      }
    }
  }

  passphraseHiddenChange(value) {
    const lastPassphrase = this.addressOrPassphrase;
    const lastPassphraseHidden = this.passphraseHidden || '';

    const lengthDiff = value.length - lastPassphraseHidden.length;
    if (lengthDiff < 0) {
      // we removed characters : make sure we removed the trailing chars
      if (lastPassphraseHidden.slice(0, lengthDiff) === value) {
        this.addressOrPassphrase = this.addressOrPassphrase.slice(0, lengthDiff);
      } else {
        // we removed some chars inside the passphrase : unsupported in the passphrase hidden mode
        // (because if we removed asterisks, we don't know which letter was behind it and can't update the plain passphrase)
        this.toastProvider.error('WALLETS_PAGE.PASSPHRASE_UNSUPPORTED_INPUT');
      }
    } else {
      // we added characters : just check that asterisks are still there and update the non-asterisk part
      const lastAsterisk = lastPassphraseHidden.lastIndexOf('*');
      if (lastPassphraseHidden.slice(0, lastAsterisk + 1) === value.slice(0, lastAsterisk + 1)) {
        this.addressOrPassphrase = this.addressOrPassphrase.slice(0, lastAsterisk + 1) + value.slice(lastAsterisk + 1);
      } else {
        // we added characters inside the asterisks part : unsupported (we wouldn't know how to update the plain passphrase)
        this.toastProvider.error('WALLETS_PAGE.PASSPHRASE_UNSUPPORTED_INPUT');
      }
    }

    this.updatePassphraseHidden();
    this.suggestWord(lastPassphrase, this.addressOrPassphrase);
  }

  updatePassphraseHidden() {
    const wordsPassphrase = (this.addressOrPassphrase || '').split(' ');
    const tmpPassphraseHidden = [];
    wordsPassphrase.forEach((elem, index, arr) => tmpPassphraseHidden.push(index === arr.length - 1 ? elem : '*'.repeat(elem.length)));
    this.passphraseHidden = tmpPassphraseHidden.join(' ');
  }

  showHidePassphrase() {
    this.hidePassphrase = !this.hidePassphrase;
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
      this.wordSuggestions = this.wordlist.filter(word => word.indexOf(lastWordPassphrase) === 0 );
    }
  }

  suggestionClick(index) {
    const wordsPassphrase = this.addressOrPassphrase.split(' ');
    wordsPassphrase[wordsPassphrase.length - 1] = this.wordSuggestions[index];
    this.addressOrPassphrase = wordsPassphrase.join(' ');
    this.updatePassphraseHidden();

    this.wordSuggestions = [];
    const inputPassphrase = this.inputAddressOrPassphrase || this.inputPassphraseHidden;
    inputPassphrase.setFocus();
  }
}
