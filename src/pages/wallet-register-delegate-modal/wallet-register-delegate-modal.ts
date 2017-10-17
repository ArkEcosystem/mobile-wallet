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
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _viewCtrl: ViewController,
    private _ele: ElementRef,
  ) {
    this.fee = this._navParams.get('fee');
    this.symbol = this._navParams.get('symbol');
  }

  closeModal() {
    this._viewCtrl.dismiss();
  }

  submitForm() {
    this._viewCtrl.dismiss(this.name);
  }

  ngAfterViewInit() {
    // Change modal size
    let claz = this._ele.nativeElement.parentElement.getAttribute('class') + ' modal-register-delegate';
    this._ele.nativeElement.parentElement.setAttribute('class', claz);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletRegisterDelegateModalPage');
  }

}
