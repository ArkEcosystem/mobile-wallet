import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import bip39 from 'bip39';

@IonicPage()
@Component({
  selector: 'page-wallet-register-second-passphrase',
  templateUrl: 'wallet-register-second-passphrase.html',
})
export class WalletRegisterSecondPassphrasePage {

  public passphrase: string;
  public fee: number;
  public symbol: string;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _viewCtrl: ViewController,
    private _ele: ElementRef,
  ) {
    this.fee = this._navParams.get('fee');
    this.passphrase = bip39.generateMnemonic();
    this.symbol = this._navParams.get('symbol');
  }

  closeModal() {
    this._viewCtrl.dismiss();
  }

  submitForm() {
    this._viewCtrl.dismiss(this.passphrase);
  }

  ngAfterViewInit() {
    // Change modal size
    let claz = this._ele.nativeElement.parentElement.getAttribute('class') + ' modal-register-second-passphrase';
    this._ele.nativeElement.parentElement.setAttribute('class', claz);
  }

}
