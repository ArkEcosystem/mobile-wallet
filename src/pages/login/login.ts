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
    this.navCtrl.setRoot('ProfileSigninPage');
  }

  openProfileCreate() {
    this.navCtrl.push('ProfileCreatePage');
  }

  ionViewDidLeave() {
    // TODO: if user not created yet
    let modal = this.modalCtrl.create('PinCodePage', {
      title: 'Create a PIN Code',
      message: 'Type your password',
      outputPassword: true,
    });

    modal.onDidDismiss((password) => {
      // TODO: storage
    });

    modal.present();
  }

}
