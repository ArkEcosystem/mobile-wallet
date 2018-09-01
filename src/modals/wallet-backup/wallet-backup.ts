import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';

import { UserDataProvider } from '@providers/user-data/user-data';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';
import { PrivateKey } from 'ark-ts/core';
import bip39 from 'bip39';
import { WalletKeys, AccountBackup } from '@models/model';

@IonicPage()
@Component({
  selector: 'modal-wallet-backup',
  templateUrl: 'wallet-backup.html',
})
export class WalletBackupModal {

  public title: string;
  public entropy: string;
  public keys: WalletKeys;
  public message: string;
  public showAdvancedOptions = false;

  public account: AccountBackup;

  private currentNetwork;
  private wordlistLanguage: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private userDataProvider: UserDataProvider,
    private settingsDataProvider: SettingsDataProvider) {
    this.title = this.navParams.get('title');
    this.entropy = this.navParams.get('entropy');
    this.keys = this.navParams.get('keys');
    this.message = this.navParams.get('message');

    if (!this.title || (!this.entropy && !this.keys)) { this.dismiss(); }

    this.currentNetwork = this.userDataProvider.currentNetwork;
    this.settingsDataProvider.settings.subscribe((settings) => this.wordlistLanguage = settings.wordlistLanguage);
  }

  next() {
    if (!this.account || !this.account.mnemonic) {
      this.dismiss(this.account);
    }

    const wordTesterModal = this.modalCtrl.create('PassphraseWordTesterModal', {
      passphrase: this.account.mnemonic,
      wordlistLanguage: this.wordlistLanguage
    });

    wordTesterModal.onDidDismiss(validationSuccess => {
      this.dismiss(validationSuccess ? this.account : null);
    });

    wordTesterModal.present();
  }

  dismiss(result?: any) {
    this.viewCtrl.dismiss(result);
  }

  toggleAdvanced() {
    this.showAdvancedOptions = !this.showAdvancedOptions;
  }

  ionViewDidLoad() {
    if (this.keys) {
      return this.generateAccountFromKeys();
    }

    this.generateAccountFromEntropy();
  }

  private generateAccountFromKeys() {
    const pvKey = PrivateKey.fromSeed(this.keys.key, this.currentNetwork);
    const pbKey = pvKey.getPublicKey();
    pbKey.setNetwork(this.currentNetwork);

    const wallet = this.userDataProvider.getWalletByAddress(pbKey.getAddress());

    const account: AccountBackup = {};
    account.address = wallet.address;
    account.mnemonic = this.keys.key;
    account.publicKey = pbKey.toHex();
    account.seed = bip39.mnemonicToSeedHex(account.mnemonic);
    if (pbKey.network.wif) {
      account.wif = pvKey.toWIF();
    }

    if (this.keys.secondKey) {
      account.secondMnemonic = this.keys.secondKey;
    }

    this.account = account;
  }

  private generateAccountFromEntropy() {
    const account: AccountBackup = {};
    const wordlist = bip39.wordlists[this.wordlistLanguage || 'english'];

    account.entropy = this.entropy;
    account.mnemonic = bip39.entropyToMnemonic(account.entropy, wordlist);

    const pvKey = PrivateKey.fromSeed(account.mnemonic, this.currentNetwork);
    const pbKey = pvKey.getPublicKey();

    account.address = pbKey.getAddress();
    account.publicKey = pbKey.toHex();
    if (pbKey.network.wif) {
      account.wif = pvKey.toWIF();
    }
    account.seed = bip39.mnemonicToSeedHex(account.mnemonic);

    this.account = account;
  }

}
