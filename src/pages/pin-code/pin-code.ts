import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-pin-code',
  templateUrl: 'pin-code.html',
})
export class PinCodePage {

  public title: string;
  public message: string;
  public password: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
  ) {
    this.password = '';
  }

  add(value: number) {
    if (this.password.length < 6) {
      this.password = this.password + value;

      if (this.password.length == 6) {
        // output
      }
    }
  }

  delete() {
    if (this.password.length > 0) {
      this.password = this.password.substring(0, this.password.length - 1);
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
