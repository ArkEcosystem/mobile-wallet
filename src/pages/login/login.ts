import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { AuthProvider } from '@providers/auth/auth';

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
    private authProvider: AuthProvider,
  ) {
  }

  openProfileSignin() {
    this.createPinCode('ProfileSigninPage');
  }

  openProfileCreate() {
    this.createPinCode('ProfileCreatePage');
  }

  private createPinCode(nextPage: string) {
    this.authProvider.getMasterPassword().subscribe((master) => {
      if (!master) {
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
                this.authProvider.saveMasterPassword(password);
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
      } else {
        this.navCtrl.push(nextPage);
      }
    });
  }

}
