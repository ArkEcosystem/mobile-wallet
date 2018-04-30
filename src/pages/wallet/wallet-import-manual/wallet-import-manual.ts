import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { UserDataProvider } from '@providers/user-data/user-data';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { ToastProvider } from '@providers/toast/toast';

import { NetworkProvider } from '@providers/network/network';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';
import { BaseWalletImport } from '@root/src/pages/wallet/wallet-import/wallet-import.base';

import * as constants from '@app/app.constants';
import bip39 from 'bip39';

@IonicPage()
@Component({
  selector: 'page-wallet-import-passphrase',
  templateUrl: 'wallet-import-manual.html',
  providers: [InAppBrowser]
})
export class WalletManualImportPage extends BaseWalletImport  {

  public addressOrPassphrase: string;
  public useAddress: boolean;
  public nonBIP39Passphrase: boolean;
  public wordSuggestions = [];

  private wordlist;
  private suggestLanguageFound = false;

  @ViewChild('inputAddressOrPassphrase') inputAddressOrPassphrase;

  constructor(
    navParams: NavParams,
    navCtrl: NavController,
    userDataProvider: UserDataProvider,
    arkApiProvider: ArkApiProvider,
    toastProvider: ToastProvider,
    modalCtrl: ModalController,
    networkProvider: NetworkProvider,
    settingsDataProvider: SettingsDataProvider,
    private inAppBrowser: InAppBrowser) {
    super(navParams, navCtrl, userDataProvider, arkApiProvider, toastProvider, modalCtrl, networkProvider, settingsDataProvider);
    this.useAddress = navParams.get('type') === 'address';
    this.nonBIP39Passphrase = false;

    this.wordlist = bip39.wordlists.english;
    if (this.wordlistLanguage && this.wordlistLanguage !== 'english') {
      this.wordlist = bip39.wordlists[this.wordlistLanguage].concat(this.wordlist);
    }
  }

  submitForm() {
    this.import(this.useAddress ? this.addressOrPassphrase : null,
                this.useAddress ? null : this.addressOrPassphrase,
                !this.nonBIP39Passphrase);
  }

  openBIP39DocURL() {
    return this.inAppBrowser.create(constants.BIP39_DOCUMENTATION_URL, '_system');
  }

  addressOrPassphraseChange(value) {
    const lastAddressOrPassphrase = this.addressOrPassphrase || '';
    this.addressOrPassphrase = value;

    if (!this.useAddress && !this.nonBIP39Passphrase && this.addressOrPassphrase) {
      this.updateWordlist();
      this.suggestWord(lastAddressOrPassphrase, this.addressOrPassphrase);
    }
  }

  updateWordlist() {
    if (this.suggestLanguageFound || !this.wordlistLanguage || this.wordlistLanguage === 'english') { return; }
    const words = this.addressOrPassphrase.split(' ');
    if (words.length < 2 ) { return; }

    words.pop(); // use every word except the last one as it may being typed
    for (const word of words) {
      if (bip39.wordlists.english.indexOf(word) !== -1 && bip39.wordlists[this.wordlistLanguage].indexOf(word) === -1) {
        this.wordlist = bip39.wordlists.english;
        this.suggestLanguageFound = true;
        return;
      }
      if (bip39.wordlists[this.wordlistLanguage].indexOf(word) !== -1 && bip39.wordlists.english.indexOf(word) === -1) {
        this.wordlist = bip39.wordlists[this.wordlistLanguage];
        this.suggestLanguageFound = true;
        return;
      }
    }
  }

  suggestWord(lastPassphrase, passphrase) {
    this.wordSuggestions = [];

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
      this.wordSuggestions = this.wordlist.filter( word => word.indexOf(lastWordPassphrase) === 0 );
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
