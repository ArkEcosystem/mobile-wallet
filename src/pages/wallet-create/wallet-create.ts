import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LocalDataProvider } from '@providers/local-data/local-data';

import bip39 from 'bip39';
import { PrivateKey, Network } from 'ark-ts';

@IonicPage()
@Component({
  selector: 'page-wallet-create',
  templateUrl: 'wallet-create.html',
})
export class WalletCreatePage {

  public account: any = {
    address: '',
    entropy: '',
    mnemonic: '',
    publicKey: '',
    seed: '',
    wif: '',
  }

  private currentNetwork: Network;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public localDataProvider: LocalDataProvider,
  ) {
    this.account.entropy = this.navParams.get('entropy');

    if (!this.account.entropy) this.navCtrl.pop();
  }

  load() {
    this.currentNetwork = this.localDataProvider.networkActive();

    this.account.mnemonic = bip39.entropyToMnemonic(this.account.entropy);

    let privateKey = PrivateKey.fromSeed(this.account.mnemonic, this.currentNetwork);
    let publicKey = privateKey.getPublicKey();

    this.account.publicKey = publicKey.toHex();
    this.account.address = publicKey.getAddress();
    this.account.wif = privateKey.toWIF();
    this.account.seed = bip39.mnemonicToSeedHex(this.account.mnemonic);
  }

  ionViewDidLoad() {
    this.load();
    console.log(this.account);
  }

}
