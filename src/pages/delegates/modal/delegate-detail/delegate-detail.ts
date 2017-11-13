import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { Delegate, Fees, Network } from 'ark-ts';

import { Clipboard } from '@ionic-native/clipboard';

@IonicPage()
@Component({
  selector: 'page-delegate-detail',
  templateUrl: 'delegate-detail.html',
  providers: [Clipboard],
})
export class DelegateDetailPage {

  public delegate: Delegate;
  public qraddress: string = '{a: ""}';
  public fees: Fees;
  public currentNetwork: Network;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private arkApiProvider: ArkApiProvider,
    private viewCtrl: ViewController,
    private clipboard: Clipboard,
  ) {
    this.delegate = this.navParams.get('delegate');
    this.qraddress = `'{a: "${this.delegate.address}"}'`;
    this.currentNetwork = this.arkApiProvider.network;
    this.arkApiProvider.fees.subscribe((fees) => this.fees = fees);

    if (!this.delegate) this.navCtrl.pop();
  }

  copyAddress() {
    this.clipboard.copy(this.delegate.address);
  }

  vote() {
    this.dismiss(true);
  }

  dismiss(status: boolean = false) {
    this.viewCtrl.dismiss(status);
  }

}
