import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'modal-enter-second-passphrase',
  templateUrl: 'enter-second-passphrase.html',
})
export class EnterSecondPassphraseModal {

  public passphrase: string;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private viewCtrl: ViewController,
  ) {
  }

  submit() {
    this.dismiss(this.passphrase);
  }

  dismiss(passphrase?: string) {
    this.viewCtrl.dismiss(passphrase);
  }


}
