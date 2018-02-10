import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { PinCodeComponent } from '@components/pin-code/pin-code';
import { AuthProvider } from '@providers/auth/auth';
import { UserDataProvider } from '@providers/user-data/user-data';

import { isNil } from 'lodash';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  @ViewChild('pinCode') pinCode: PinCodeComponent;

  public hasProfiles = false;
  public isReady = false;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private authProvider: AuthProvider,
    private userDataProvider: UserDataProvider,
  ) {
    this.authProvider.getMasterPassword().do(master => {
      this.hasProfiles = master && !isNil(this.userDataProvider.profiles);
      this.isReady = true;
    }).subscribe();
  }

  openProfileSignin() {
    this.pinCode.createUpdatePinCode('ProfileSigninPage');
  }

  openProfileCreate() {
    this.pinCode.createUpdatePinCode('ProfileCreatePage');
  }

}
