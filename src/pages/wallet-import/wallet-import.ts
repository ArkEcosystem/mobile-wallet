import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-wallet-import',
  templateUrl: 'wallet-import.html',
})
export class WalletImportPage {

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams
  ) { }

  openWalletImportPassphrase() {
    this._navCtrl.push('WalletImportPassphrasePage');
  }

}
