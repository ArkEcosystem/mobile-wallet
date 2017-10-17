import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
  ) { }

  openProfileSignin() {
    this._navCtrl.setRoot('ProfileSigninPage');
  }

  openProfileCreate() {
    this._navCtrl.push('ProfileCreatePage');
  }

}
