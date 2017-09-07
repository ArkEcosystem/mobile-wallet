import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { LocalDataProvider } from '@providers/local-data/local-data';
import { TranslateService } from '@ngx-translate/core';

import lodash from 'lodash';

@IonicPage()
@Component({
  selector: 'page-profile-signin',
  templateUrl: 'profile-signin.html',
})
export class ProfileSigninPage {

  public profiles;
  public profilesIds;

  public networks;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public localDataProvider: LocalDataProvider,
    public translateService: TranslateService,
  ) { }

  openProfileCreate() {
    this.navCtrl.push('ProfileCreatePage');
  }

  delete(profileId: string) {
    return this.localDataProvider.profileRemove(profileId).subscribe((result) => {
      this.load();
    });
  }

  load() {
    this.profiles = this.localDataProvider.profiles;
    this.profilesIds = Object.keys(this.profiles);

    this.networks = this.localDataProvider.networks;
  }

  isEmpty() {
    return lodash.isEmpty(this.profiles);
  }

  ionViewDidLoad() {
    this.load();
  }
}
