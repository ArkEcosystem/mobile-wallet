import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { PinCodeComponent } from '@components/pin-code/pin-code';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  @ViewChild('pinCode') pinCode: PinCodeComponent;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
  ) {
  }

  openProfileSignin() {
    this.pinCode.createUpdatePinCode('ProfileSigninPage');
  }

  openProfileCreate() {
    this.pinCode.createUpdatePinCode('ProfileCreatePage');
  }

}
