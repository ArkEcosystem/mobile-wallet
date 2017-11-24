import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { UserDataProvider } from '@providers/user-data/user-data';
import { PrivateKey } from 'ark-ts/core';
import bip39 from 'bip39';

@IonicPage()
@Component({
  selector: 'modal-wallet-backup',
  templateUrl: 'wallet-backup.html',
})
export class WalletBackupModal {

  public title: string;
  public entropy: string;
  public passphrases: string;
  public message: string;

  public account: any;

  private currentNetwork;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private userDataProvider: UserDataProvider,
  ) {
    this.title = this.navParams.get('title');
    this.entropy = this.navParams.get('entropy');
    this.passphrases = this.navParams.get('passphrases');
    this.message = this.navParams.get('message');

    if (!this.title || (!this.entropy && !this.passphrases)) this.dismiss();

    this.currentNetwork = this.userDataProvider.currentNetwork;
  }

  next() {
    this.dismiss(this.account);
  }

  dismiss(result?: boolean) {
    this.viewCtrl.dismiss(result);
  }

  ionViewDidLoad() {
    this.account = {};

    if (this.passphrases) {
      this.account.mnemonic = this.passphrases['passphrase'];
      // this.account.entropy = bip39.mnemonicToEntropy(this.account.mnemonic);
      this.account.secondPassphrase = this.passphrases['secondPassphrase'];
    } else if (this.entropy) {
      this.account.entropy = this.entropy;
      this.account.mnemonic = bip39.entropyToMnemonic(this.account.entropy);
    }

    let pvKey = PrivateKey.fromSeed(this.account.mnemonic, this.currentNetwork);
    let pbKey = pvKey.getPublicKey();

    this.account.address = pbKey.getAddress();
    this.account.qraddress = `{"a": "${this.account.address}"}`;
    this.account.publicKey = pbKey.toHex();
    this.account.wif = pvKey.toWIF();
    this.account.seed = bip39.mnemonicToSeedHex(this.account.mnemonic);
  }

}
