import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-wallet-register-delegate-modal',
  templateUrl: 'wallet-register-delegate-modal.html',
})
export class WalletRegisterDelegateModalPage {

  public fee: string;
  public symbol: string;
  public name: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
  ) {
    this.fee = this.navParams.get('fee');
    this.symbol = this.navParams.get('symbol');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  submitForm() {
    this.viewCtrl.dismiss(this.name);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletRegisterDelegateModalPage');
  }

}
