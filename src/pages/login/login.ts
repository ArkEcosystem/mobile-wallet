import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
  ) {
  }

  openProfileSignin() {
    this.createPinCode('ProfileSigninPage');
  }

  openProfileCreate() {
    this.createPinCode('ProfileCreatePage');
  }

  private createPinCode(nextPage: string) {
    // TODO: verify if the pincode has set
    let createModal = this.modalCtrl.create('PinCodePage', {
      message: 'PIN_CODE.CREATE',
      outputPassword: true,
    });

    createModal.onDidDismiss((password) => {
      if (password) {
        let validateModal = this.modalCtrl.create('PinCodePage', {
          message: 'PIN_CODE.CONFIRM',
          expectedPassword: password,
        });

        validateModal.onDidDismiss((status) => {
          if (status) {
            this.navCtrl.push(nextPage);
          } else {
            // TODO: fail
          }
        })

        validateModal.present();
      } else {
        // TODO: fail
      }
    });

    createModal.present();
  }

}
