import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { UserDataProvider } from '@providers/user-data/user-data';
import { Delegate, Fees, Network } from 'ark-ts';

import { Wallet } from '@models/wallet';

import { TranslateService } from '@ngx-translate/core';
import { Clipboard } from '@ionic-native/clipboard';
import lodash from 'lodash';
import { ToastProvider } from '@providers/toast/toast';

@IonicPage()
@Component({
  selector: 'page-delegate-detail',
  templateUrl: 'delegate-detail.html',
  providers: [Clipboard],
})
export class DelegateDetailPage {

  public delegate: Delegate;
  public qraddress = '{a: ""}';
  public fees: Fees;
  public currentNetwork: Network;
  public currentWallet: Wallet;
  public walletVote: Delegate;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private arkApiProvider: ArkApiProvider,
    private viewCtrl: ViewController,
    private clipboard: Clipboard,
    private userDataProvider: UserDataProvider,
    private alertCtrl: AlertController,
    private translateService: TranslateService,
    private toastProvider: ToastProvider,
  ) {
    this.delegate = this.navParams.get('delegate');
    this.walletVote = this.navParams.get('vote');

    this.qraddress = `'{a: "${this.delegate.address}"}'`;
    this.currentNetwork = this.arkApiProvider.network;
    this.currentWallet = this.userDataProvider.currentWallet;

    this.arkApiProvider.fees.subscribe((fees) => this.fees = fees);

    if (!this.delegate) { this.navCtrl.pop(); }
  }

  isSameDelegate() {
    if (this.currentWallet && this.walletVote && this.delegate.publicKey === this.walletVote.publicKey) {
      return true;
    }

    return false;
  }

  isWalletSelected() {
    return !lodash.isNil(this.currentWallet);
  }

  copyAddress() {
    this.clipboard.copy(this.delegate.address).then(
      () => this.toastProvider.success('COPIED_CLIPBOARD'),
      () => this.toastProvider.error('COPY_CLIPBOARD_FAILED'));
  }

  submit() {
    if (!this.currentWallet) { return false; }

    if (this.walletVote && this.walletVote.publicKey !== this.delegate.publicKey) {
      this.translateService.get([
        'DELEGATES_PAGE.UNVOTE_CURRENT_DELEGATE',
        'CANCEL',
        'DELEGATES_PAGE.UNVOTE'
      ], { delegate: this.walletVote.username })
        .subscribe((translation) => {
          const alert = this.alertCtrl.create({
            title: translation['DELEGATES_PAGE.UNVOTE'],
            message: translation['DELEGATES_PAGE.UNVOTE_CURRENT_DELEGATE'],
            buttons: [{
              text: translation.CANCEL,
            }, {
              text: translation['DELEGATES_PAGE.UNVOTE'],
              handler: () => {
                this.unvote();
              }
            }]
          });

          alert.present();
        });
    } else {
      this.dismiss(this.delegate);
    }

  }

  unvote() {
    this.dismiss(this.walletVote);
  }

  dismiss(delegate?: Delegate) {
    this.viewCtrl.dismiss(delegate);
  }

}
