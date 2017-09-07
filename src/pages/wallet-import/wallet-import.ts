import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-wallet-import',
  templateUrl: 'wallet-import.html',
})
export class WalletImportPage {
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

  openWalletImportPassphrase() {
    this.navCtrl.push('WalletImportPassphrasePage');
  }

}
