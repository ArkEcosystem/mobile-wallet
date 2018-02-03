import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';

import { UserDataProvider } from '@providers/user-data/user-data';
import { PrivateKey } from 'ark-ts/core';
import bip39 from 'bip39';
import { WalletKeys, AccountBackup, PassphraseWord } from '@models/model';
import { ArkUtility } from '../../utils/ark-utility';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private userDataProvider: UserDataProvider) {
    this.title = this.navParams.get('title');
    this.entropy = this.navParams.get('entropy');
    this.keys = this.navParams.get('keys');
    this.message = this.navParams.get('message');

    if (!this.title || (!this.entropy && !this.keys)) { this.dismiss(); }

    this.currentNetwork = this.userDataProvider.currentNetwork;
  }

  next() {
    if (!this.account || !this.account.mnemonic) {
      this.dismiss(this.account);
    }

    const wordTesterModal = this.modalCtrl.create('PassphraseWordTesterModal', {
      words: this.getRandomWords(3, this.account.mnemonic.split(' '))
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

  private getRandomWords(numberOfWords: number, words: string[]): PassphraseWord[] {
    numberOfWords = words.length >= numberOfWords ? numberOfWords : words.length;

    const randomWords: PassphraseWord[] = [];
    while (randomWords.length !== numberOfWords) {
      const randomIndex: number = ArkUtility.getRandomInt(0, words.length - 1);
      if (randomWords.every(w => w.number - 1 !== randomIndex)) {
        const randomWord: string = words[randomIndex];
        randomWords.push(new PassphraseWord(randomWord,
                                            randomIndex + 1,
                                            this.userDataProvider.isDevNet ? randomWord : null));
      }
    }

    return randomWords.sort((one, two) => one.number - two.number);
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
    account.wif = pvKey.toWIF();

    if (this.keys.secondKey) {
      account.secondMnemonic = this.keys.secondKey;
    }

    this.account = account;
  }

  private generateAccountFromEntropy() {
    const account: AccountBackup = {};

    account.entropy = this.entropy;
    account.mnemonic = bip39.entropyToMnemonic(account.entropy);

    const pvKey = PrivateKey.fromSeed(account.mnemonic, this.currentNetwork);
    const pbKey = pvKey.getPublicKey();

    account.address = pbKey.getAddress();
    account.publicKey = pbKey.toHex();
    account.wif = pvKey.toWIF();
    account.seed = bip39.mnemonicToSeedHex(account.mnemonic);

    this.account = account;
  }

}
