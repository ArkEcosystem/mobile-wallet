import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { Wallet } from '@models/wallet';
import { UserDataProvider } from '@providers/user-data/user-data';

import { PrivateKey, Network } from 'ark-ts';
import bip39 from 'bip39';

@IonicPage()
@Component({
  selector: 'page-wallet-create',
  templateUrl: 'wallet-create.html',
})
export class WalletCreatePage {

  public account: any = {
    address: '',
    qraddress: '{a: ""}',
    entropy: '',
    mnemonic: '',
    qrpassphrase: '',
    publicKey: '',
    seed: '',
    wif: '',
  }
  public keySegment: string = 'public';

  private _currentNetwork: Network;
  private _unsubscriber: Subject<void> = new Subject<void>();

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _userDataProvider: UserDataProvider,
  ) {
    this.account.entropy = this._navParams.get('entropy');
    if (!this.account.entropy) this._navCtrl.popToRoot();
  }

  load() {
    this._currentNetwork = this._userDataProvider.networkActive;

    this.account.mnemonic = bip39.entropyToMnemonic(this.account.entropy);
    this.account.qrpassphrase = `{"passphrase": "${this.account.mnemonic}"}`;

    let privateKey = PrivateKey.fromSeed(this.account.mnemonic, this._currentNetwork);
    let publicKey = privateKey.getPublicKey();

    this.account.publicKey = publicKey.toHex();
    this.account.address = publicKey.getAddress();
    this.account.qraddress = `{"a": "${this.account.address}"}`;

    this.account.wif = privateKey.toWIF();
    this.account.seed = bip39.mnemonicToSeedHex(this.account.mnemonic);
  }

  storeWallet() {
    let wallet = new Wallet();
    wallet.address = this.account.address;
    wallet.publicKey = this.account.publicKey;

    this._userDataProvider.walletAdd(wallet).takeUntil(this._unsubscriber).subscribe((response) => {
      this._navCtrl.setRoot('ProfileSigninPage');
    });
  }

  ionViewDidLoad() {
    this.load();
  }

  ngOnDestroy() {
    this._unsubscriber.next();
    this._unsubscriber.complete();
  }

}
