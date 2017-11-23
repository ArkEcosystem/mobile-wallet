import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';

import { AuthProvider } from '@providers/auth/auth';

@IonicPage()
@Component({
  selector: 'modal-pin-code',
  templateUrl: 'pin-code.html',
  providers: [Vibration],
})
export class PinCodeModal {

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
    private authProvider: AuthProvider,
    private zone: NgZone,
    private vibration: Vibration,
  ) {
    this.password = '';
    this.message = this.navParams.get('message');
    this.expectedPassword = this.navParams.get('expectedPassword');
    this.outputPassword = this.navParams.get('outputPassword') || false;
    this.validatePassword = this.navParams.get('validatePassword') || false;
  }

  add(value: number) {
    this.vibration.vibrate(100);

    if (this.password.length < 6) {
      this.zone.run(() => {
        this.password = this.password + value;
      });

      if (this.password.length == 6) {

        if (!this.expectedPassword && !this.validatePassword) {
          return this.dismiss(true);
        }

        // Confirm with the previous entered password
        if (this.expectedPassword) {
          if (this.expectedPassword !== this.password) {
            this.setWrong();
          } else {
            this.dismiss(true);
          }
        }

        if (this.validatePassword) {
          this.authProvider.validateMasterPassword(this.password).subscribe((result) => {
            if (!result) {
              this.setWrong();
            } else {
              this.dismiss(true);
            }
          });
        }

      }
    }
  }

  setWrong() {
    this.vibration.vibrate(500);

    this.zone.run(() => {
      this.isWrong = true;
      this.password = '';
      this.message = 'PIN_CODE.WRONG';

      setTimeout(() => {
        this.isWrong = false;
      }, 500);
    });
  }

  delete() {
    this.vibration.vibrate(100);

    if (this.password.length > 0) {
      this.zone.run(() => {
        this.password = this.password.substring(0, this.password.length - 1);
      });
    }
  }

  dismiss(status: boolean = true) {
    if (this.outputPassword) {
      this.viewCtrl.dismiss(this.password);
      return;
    }

    this.viewCtrl.dismiss(status);
  }
}
