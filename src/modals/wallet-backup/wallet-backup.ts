import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { UserDataProvider } from '@providers/user-data/user-data';
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
  public showAdvancedOptions: boolean = false;

  public account: AccountBackup = {};

  private currentNetwork;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private userDataProvider: UserDataProvider,
  ) {
    this.title = this.navParams.get('title');
    this.entropy = this.navParams.get('entropy');
    this.keys = this.navParams.get('keys');
    this.message = this.navParams.get('message');

    if (!this.title || (!this.entropy && !this.keys)) this.dismiss();

    this.currentNetwork = this.userDataProvider.currentNetwork;
  }

  next() {
    this.dismiss(this.account);
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
    console.log(this.keys);
    let pvKey = PrivateKey.fromSeed(this.keys.key, this.currentNetwork);
    let pbKey = pvKey.getPublicKey();
    pbKey.setNetwork(this.currentNetwork);

    let wallet = this.userDataProvider.getWalletByAddress(pbKey.getAddress());

    this.account.address = wallet.address;
    this.account.qrAddress = `{"a": "${this.account.address}"}`;
    this.account.mnemonic = this.keys.key;
    // this.account.bip38 = wallet.bip38;
    this.account.publicKey = pbKey.toHex();
    this.account.seed = bip39.mnemonicToSeedHex(this.account.mnemonic);
    this.account.wif = pvKey.toWIF();

    if (this.keys.secondKey) {
      // this.account.secondBip38 = wallet.secondBip38;
      this.account.secondMnemonic = this.keys.secondKey;
    }
  }

  private generateAccountFromEntropy() {
    this.account.entropy = this.entropy;
    this.account.mnemonic = bip39.entropyToMnemonic(this.account.entropy);

    let pvKey = PrivateKey.fromSeed(this.account.mnemonic, this.currentNetwork);
    let pbKey = pvKey.getPublicKey();

    this.account.address = pbKey.getAddress();
    this.account.qrAddress = `{"a": "${this.account.address}"}`;
    this.account.publicKey = pbKey.toHex();
    this.account.wif = pvKey.toWIF();
    this.account.seed = bip39.mnemonicToSeedHex(this.account.mnemonic);
  }

}
