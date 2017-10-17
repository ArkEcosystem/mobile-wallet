import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthProvider } from '@providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  public showSkip: boolean = true;

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _authProvider: AuthProvider,
  ) { }

  startApp() {
    this._authProvider.saveIntro();

    this._navCtrl.setRoot('LoginPage', {}, {
      animate: true,
      direction: 'forward'
    });
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

}
