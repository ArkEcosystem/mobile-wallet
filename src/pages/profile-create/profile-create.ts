import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

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

  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userDataProvider: UserDataProvider,
  ) { }

  onSelectNetwork(networkId: string) {
    this.newProfile.networkId = networkId;
  }

  submitForm() {
    let profile = new Profile();
    profile.name = this.newProfile.name;
    profile.networkId = this.newProfile.networkId;

    this.userDataProvider.addProfile(profile).takeUntil(this.unsubscriber$).subscribe((result) => {
      this.navCtrl.setRoot('ProfileSigninPage');
    }, () => {
      // TODO: Toast error
    });
  }

  load() {
    this.networks = this.userDataProvider.networks;
    this.networksIds = lodash.keys(this.networks);
    this.newProfile.networkId = this.networksIds[0];
  }

  ionViewDidLoad() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
