import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'modal-enter-second-passphrase',
  templateUrl: 'enter-second-passphrase.html',
})
export class EnterSecondPassphraseModal {

  public passphrase: string;

  constructor(
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
