import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { PinCodeComponent } from '@/components/pin-code/pin-code';
import { AuthProvider } from '@/services/auth/auth';
import { UserDataProvider } from '@/services/user-data/user-data';

import { isNil } from 'lodash';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  @ViewChild('pinCode', { read: PinCodeComponent, static: true }) pinCode: PinCodeComponent;

  public hasProfiles = false;
  public isReady = false;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private authProvider: AuthProvider,
    private userDataProvider: UserDataProvider,
  ) {
    this.authProvider.getMasterPassword().subscribe(master => {
      this.hasProfiles = master && !isNil(this.userDataProvider.profiles);
      this.isReady = true;
    });
  }

  openProfileSignin() {
    this.pinCode.createUpdatePinCode('/profile/signin');
  }

  openProfileCreate() {
    this.pinCode.createUpdatePinCode('/profile/create');
  }

}
