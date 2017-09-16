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
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public ele: ElementRef,
  ) {
    this.fee = this.navParams.get('fee');
    this.passphrase = bip39.generateMnemonic();
    this.symbol = this.navParams.get('symbol');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  submitForm() {
    this.viewCtrl.dismiss(this.passphrase);
  }

  ngAfterViewInit() {
    // Change modal size
    let claz = this.ele.nativeElement.parentElement.getAttribute('class') + ' modal-register-second-passphrase';
    this.ele.nativeElement.parentElement.setAttribute('class', claz);
  }

}
