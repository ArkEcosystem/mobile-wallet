import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { ToastProvider } from '@/services/toast/toast';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-transaction-receive',
  templateUrl: 'transaction-receive.html',
  styleUrls: ['transaction-receive.scss'],
  providers: [Clipboard],
})
export class TransactionReceivePage {

  public address;
  public qraddress: any;
  public tokenParam: Object;

  constructor(
    public navCtrl: NavController,
    public route: ActivatedRoute,
    private clipboard: Clipboard,
    private toastProvider: ToastProvider,
    private socialSharing: SocialSharing,
  ) {
    this.address = this.route.snapshot.queryParamMap.get('address');
    this.tokenParam = {Token: this.route.snapshot.queryParamMap.get('token')};

    this.qraddress = `'{"a": "${this.address}"}'`;
  }

  copyAddress() {
    this.clipboard.copy(this.address).then(
      () => this.toastProvider.success('COPIED_CLIPBOARD'),
      () => this.toastProvider.error('COPY_CLIPBOARD_FAILED'));
  }

  share() {
    this.socialSharing.share(this.address).then(null, (error) => this.toastProvider.error(error));
  }

}
