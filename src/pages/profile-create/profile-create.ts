import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Profile } from '@models/profile';
import { UserDataProvider } from '@providers/user-data/user-data';

import lodash from 'lodash';

@IonicPage()
@Component({
  selector: 'page-profile-create',
  templateUrl: 'profile-create.html',
})
export class ProfileCreatePage {

  public networks;
  public networksIds;

  public newProfile = { name: '', networkId: '' };

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _userDataProvider: UserDataProvider,
  ) { }

  onSelectNetwork(networkId: string) {
    this.newProfile.networkId = networkId;
  }

  submitForm() {
    let profile = new Profile();
    profile.name = this.newProfile.name;
    profile.networkId = this.newProfile.networkId;

    this._userDataProvider.profileAdd(profile).subscribe((result) => {
      this._navCtrl.setRoot('ProfileSigninPage');
    }, () => {
      // TODO: Toast error
    });
  }

  load() {
    this.networks = this._userDataProvider.networks;
    this.networksIds = lodash.keys(this.networks);
    this.newProfile.networkId = this.networksIds[0];
  }

  ionViewDidLoad() {
    this.load();
  }

}
