import {Component, OnDestroy} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { Profile } from '@models/profile';
import { UserDataProvider } from '@providers/user-data/user-data';
import { ToastProvider } from '@providers/toast/toast';

import lodash from 'lodash';

@IonicPage()
@Component({
  selector: 'page-profile-create',
  templateUrl: 'profile-create.html',
})
export class ProfileCreatePage implements OnDestroy {

  public networks;
  public networksIds;

  public newProfile = { name: '', networkId: '' };
  public showAdvancedOptions = false;

  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userDataProvider: UserDataProvider,
    private toastProvider: ToastProvider,
  ) { }

  onSelectNetwork(networkId: string) {
    this.newProfile.networkId = networkId;
  }

  submitForm() {
    const profile = new Profile();
    profile.name = this.newProfile.name;
    profile.networkId = this.newProfile.networkId;

    this.userDataProvider.addProfile(profile).takeUntil(this.unsubscriber$).subscribe(() => {
      this.navCtrl.setRoot('ProfileSigninPage');
    }, () => {
      this.toastProvider.error('PROFILES_PAGE.ADD_PROFILE_ERROR');
    });
  }

  load() {
    this.networks = this.userDataProvider.networks;
    this.networksIds = lodash.keys(this.networks);
    this.newProfile.networkId = this.networksIds[0];
  }

  toggleAdvanced() {
    this.showAdvancedOptions = !this.showAdvancedOptions;
  }

  ionViewDidLoad() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
