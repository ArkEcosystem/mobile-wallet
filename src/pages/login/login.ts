import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MarketDataProvider } from '@providers/market-data/market-data';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [MarketDataProvider]
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, marketDataProvider: MarketDataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  openProfileSignin() {
    this.navCtrl.setRoot('ProfileSigninPage');
  }

  openProfileCreate() {
    this.navCtrl.push('ProfileCreatePage');
  }

}
