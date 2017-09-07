import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Profile } from '@models/profile';
import { LocalDataProvider } from '@providers/local-data/local-data';

import { PublicKey, PrivateKey, Network } from 'ark-ts';

@IonicPage()
@Component({
  selector: 'page-wallet-import',
  templateUrl: 'wallet-import.html',
})
export class WalletImportPage {

  public currentProfile: Profile;
  public currentNetwork: Network;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public localDataProvider: LocalDataProvider,
  ) { }

  ionViewDidLoad() {
    this.load();
  }

  load() {
    this.currentProfile = this.localDataProvider.profileActive();
    // this.currentNetwork = this.localDataProvider.networks[this.currentProfile.networkId];
  }

}
