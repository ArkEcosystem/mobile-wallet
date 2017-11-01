import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-pin-code',
  templateUrl: 'pin-code.html',
})
export class PinCodePage {

  public message: string;
  public password: string;
  public isWrong: boolean = false;

  // Send a password created before, useful for create pin and confirm
  private expectedPassword: string;
  // Will send back the entered password
  private outputPassword: boolean = false;
  // Check if the entered password is correct
  private validatePassword: boolean = false;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
  ) {
    this.password = '';
    this.message = this.navParams.get('message');
    this.expectedPassword = this.navParams.get('expectedPassword');
    this.outputPassword = this.navParams.get('outputPassword') || false;
    this.validatePassword = this.navParams.get('validatePassword') || false;
  }

  add(value: number) {
    if (this.password.length < 6) {
      this.password = this.password + value;

      if (this.password.length == 6) {
        // Confirm with the previous entered password
        if (this.expectedPassword && this.expectedPassword !== this.password) {
          this.setWrong();
          return;
        }

        if (this.validatePassword) {
          // TODO: validate
          this.setWrong();
          return;
        }

        this.dismiss();
      }
    }
  }

  setWrong() {
    this.isWrong = true;
    this.password = '';
    if (this.expectedPassword) this.message = 'PIN_CODE.WRONG';

    setTimeout(() => {
      this.isWrong = false;
    }, 500);
  }

  delete() {
    if (this.password.length > 0) {
      this.password = this.password.substring(0, this.password.length - 1);
    }
  }

  dismiss() {
    if (this.outputPassword) {
      this.viewCtrl.dismiss(this.password);
      return;
    }

    this.viewCtrl.dismiss(true);
  }
}
