import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Profile } from '@models/profile';
import { LocalDataProvider } from '@providers/local-data/local-data';

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
    public navCtrl: NavController,
    public navParams: NavParams,
    public localDataProvider: LocalDataProvider,
  ) { }

  onSelectNetwork(networkId: string) {
    this.newProfile.networkId = networkId;
  }

  submitForm() {
    let profile = new Profile();
    profile.name = this.newProfile.name;
    profile.networkId = this.newProfile.networkId;

    this.localDataProvider.profileAdd(profile).subscribe((result) => {
      this.navCtrl.setRoot('ProfileSigninPage');
    });
  }

  load() {
    this.networks = this.localDataProvider.networks;
    this.networksIds = Object.keys(this.networks);
    this.newProfile.networkId = this.networksIds[0];
  }

  ionViewDidLoad() {
    this.load();
  }

}
