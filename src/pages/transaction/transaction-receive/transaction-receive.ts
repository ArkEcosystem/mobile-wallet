import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';

import { ToastProvider } from '@providers/toast/toast';
import { SocialSharing } from '@ionic-native/social-sharing';

@IonicPage()
@Component({
  selector: 'page-transaction-receive',
  templateUrl: 'transaction-receive.html',
  providers: [Clipboard],
})
export class TransactionReceivePage {

  public address;
  public qraddress: any;
  public token;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private clipboard: Clipboard,
    private toastProvider: ToastProvider,
    private socialSharing: SocialSharing,
  ) {
    this.address = this.navParams.get('address');
    this.token = this.navParams.get('token');

    this.qraddress = `'{"a": "${this.address}"}'`;
  }

  copyAddress() {
    this.clipboard.copy(this.address);
    this.toastProvider.success('ADDRESS_COPIED_TEXT')
  }

  share() {
    this.socialSharing.share(this.address).then(null, (error) => this.toastProvider.error(error));
  }

}
