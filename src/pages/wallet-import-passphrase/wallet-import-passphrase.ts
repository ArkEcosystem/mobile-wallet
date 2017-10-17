import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { Profile, Wallet } from '@models/model';
import { UserDataProvider } from '@providers/user-data/user-data';
import { ArkApiProvider } from '@providers/ark-api/ark-api';

import { PublicKey, PrivateKey, Network } from 'ark-ts';

@IonicPage()
@Component({
  selector: 'page-wallet-import-passphrase',
  templateUrl: 'wallet-import-passphrase.html',
})
export class WalletImportPassphrasePage {

  public currentProfile: Profile;
  public currentNetwork: Network;
  public passphrase: string = '';

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _userDataProvider: UserDataProvider,
    private _loadingCtrl: LoadingController,
    private _arkApiProvider: ArkApiProvider,
  ) { }

  load() {
    this.currentProfile = this._userDataProvider.profileActive;
    this.currentNetwork = this._userDataProvider.networkActive;
  }

  submitForm() {
    let privateKey = PrivateKey.fromSeed(this.passphrase, this.currentNetwork);
    let publicKey = privateKey.getPublicKey();
    let address = publicKey.getAddress();

    let newWallet = new Wallet();

    this._arkApiProvider.api.account.get({ address }).subscribe((response) => {
      if (response && response.success) {
        let account = response.account;

        newWallet = newWallet.deserialize(account);
      } else {
        newWallet.address = address;
        newWallet.publicKey = publicKey.toHex();
      }

      this._userDataProvider.walletAdd(newWallet).subscribe((result) => {
        this._navCtrl.setRoot('WalletDashboardPage', { address: newWallet.address });
      });
    }, () => {
      // TODO: Show error in toast
    });
  }

  ionViewDidLoad() {
    this.load();
  }

}
