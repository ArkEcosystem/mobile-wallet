import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';

import { ToastProvider } from '@providers/toast/toast';

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
    private _clipboard: Clipboard,
    private toastProvider: ToastProvider,
  ) {
    this.address = this.navParams.get('address');
    this.token = this.navParams.get('token');
  }

  copyAddress() {
    this._clipboard.copy(this.address);
    this.toastProvider.success('ADDRESS_COPIED_TEXT')
  }

  // TODO: Share

}
