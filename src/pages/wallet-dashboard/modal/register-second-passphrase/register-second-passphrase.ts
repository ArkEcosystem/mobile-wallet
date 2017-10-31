import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { Clipboard } from '@ionic-native/clipboard';
import bip39 from 'bip39';

@IonicPage()
@Component({
  selector: 'page-register-second-passphrase',
  templateUrl: 'register-second-passphrase.html',
  providers: [Clipboard],
})
export class RegisterSecondPassphrasePage {
  public fee;
  public symbol;
  public passphrase: string;
  public repassphrase: string;

  public isBip39: boolean = false;
  public isInvalidPassphrase: boolean = true;
  public isInvalidForm: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private clipboard: Clipboard,
  ) {
    this.fee = this.navParams.get('fee');
    this.symbol = this.navParams.get('symbol');
  }

  copyPassphrase() {
    this.clipboard.copy(this.passphrase);
  }

  validatePassphrase() {
    if (!this.isInvalidPassphrase) {
      this.repassphrase = '';
    }

    if (this.passphrase.length < 3) {
      this.isInvalidPassphrase = true;
      return;
    }

    this.isInvalidPassphrase = false;
  }

  validateRepassphrase() {
    this.isInvalidForm = this.passphrase !== this.repassphrase;
  }

  generate() {
    this.isBip39 = true;
    this.isInvalidForm = false;
    this.passphrase = bip39.generateMnemonic();
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  submitForm() {
    if (this.isInvalidForm) return;

    this.viewCtrl.dismiss(this.passphrase);
  }

}
