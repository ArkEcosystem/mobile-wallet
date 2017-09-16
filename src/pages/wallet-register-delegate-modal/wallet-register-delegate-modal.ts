import { Component, ElementRef } from '@angular/core';
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
    public ele: ElementRef,
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

  ngAfterViewInit() {
    // Change modal size
    let claz = this.ele.nativeElement.parentElement.getAttribute('class') + ' modal-register-delegate';
    this.ele.nativeElement.parentElement.setAttribute('class', claz);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletRegisterDelegateModalPage');
  }

}
