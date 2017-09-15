import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-wallet-label-modal',
  templateUrl: 'wallet-label-modal.html',
})
export class WalletLabelModalPage {

  public label: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewController: ViewController,
  ) {
    this.label = this.navParams.get('label') || '';
  }

  closeModal() {
    this.viewController.dismiss();
  }

  submitForm() {
    this.viewController.dismiss(this.label);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletLabelModalPage');
  }

}
