import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { Profile, Wallet } from '@models/model';
import { UserDataProvider } from '@providers/user-data/user-data';

import { PublicKey, PrivateKey, Network, Http, AccountApi } from 'ark-ts';

@IonicPage()
@Component({
  selector: 'page-wallet-import-passphrase',
  templateUrl: 'wallet-import-passphrase.html',
})
export class WalletImportPassphrasePage {

  public currentProfile: Profile;
  public currentNetwork: Network = new Network();
  public passphrase: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userDataProvider: UserDataProvider,
    public loadingCtrl: LoadingController,
  ) { }

  load() {
    this.currentProfile = this.userDataProvider.profileActive;

    let networkData = this.userDataProvider.networkGet(this.currentProfile.networkId);
    Object.assign(this.currentNetwork, networkData);
  }

  submitForm() {
    let privateKey = PrivateKey.fromSeed(this.passphrase, this.currentNetwork);
    let publicKey = privateKey.getPublicKey();
    let address = publicKey.getAddress();

    let http = new Http(this.currentNetwork);
    let api = new AccountApi(http);

    let newWallet = new Wallet();

    api.get({ address }).subscribe((response) => {
      if (response && response.success) {
        let account = response.account;

        newWallet = newWallet.deserialize(account);
      } else {
        newWallet.address = address;
        newWallet.publicKey = publicKey.toHex();
      }

      this.userDataProvider.walletAdd(newWallet).subscribe((result) => {
        this.navCtrl.setRoot('WalletDashboardPage', { address: newWallet.address });
      });
    }, () => {
      // TODO: Show error in toast
    });
  }

  ionViewDidLoad() {
    this.load();
  }

}
