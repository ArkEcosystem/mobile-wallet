import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
  ) { }

  openProfileSignin() {
    this.navCtrl.setRoot('ProfileSigninPage');
  }

  openProfileCreate() {
    this.navCtrl.push('ProfileCreatePage');
  }

}
