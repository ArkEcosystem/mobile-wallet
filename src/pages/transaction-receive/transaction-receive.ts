import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';

@IonicPage()
@Component({
  selector: 'page-transaction-receive',
  templateUrl: 'transaction-receive.html',
  providers: [Clipboard],
})
export class TransactionReceivePage {

  public address;
  public token;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private clipboard: Clipboard,
  ) {
    this.address = this.navParams.get('address');
    this.token = this.navParams.get('token');
  }

  copyAddress() {
    this.clipboard.copy(this.address);
    // TODO: Toast message
  }

  // TODO: Share

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletReceivePage');
  }

}
