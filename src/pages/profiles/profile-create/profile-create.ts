import {Component, OnDestroy} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { Profile } from '@models/profile';
import { UserDataProvider } from '@providers/user-data/user-data';
import { ToastProvider } from '@providers/toast/toast';

import lodash from 'lodash';
import {Network} from 'ark-ts/model';
import {TranslateService} from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-profile-create',
  templateUrl: 'profile-create.html',
})
export class ProfileCreatePage implements OnDestroy {

  public networks: {[networkId: string]: Network};
  public networksIds: string[];
  public networkChoices: {name: string, id?: string}[] = [];

  public activeNetworkChoice: {name: string, id?: string};

  public newProfile = { name: '', networkId: '' };
  public showAdvancedOptions = false;

  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userDataProvider: UserDataProvider,
    private toastProvider: ToastProvider,
    private translateService: TranslateService
  ) { }

  onSelectNetwork(networkChoice: {name: string, id?: string}) {
    this.activeNetworkChoice = networkChoice;
    this.newProfile.networkId = networkChoice.id;
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
    this.translateService.get('PROFILES_PAGE.CUSTOM').subscribe(customTrans => {
      this.networks = this.userDataProvider.networks;
      this.networksIds = lodash.keys(this.networks);
      this.networkChoices =
        this.networksIds
          .filter(id => this.userDataProvider
                            .defaultNetworks
                            .some(defaultNetwork => this.networks[id].nethash === defaultNetwork.nethash))
          .map(id => {
            return {name: this.networks[id].name, id: id};
          });
      this.networkChoices.push({name: customTrans, id: null});
      this.newProfile.networkId = this.networksIds[0];
      this.activeNetworkChoice = this.networkChoices[0];
    });
  }

  toggleAdvanced() {
    this.showAdvancedOptions = !this.showAdvancedOptions;
  }

  public onCustomNetworkChange(customNetworkId: string) {
    this.newProfile.networkId = customNetworkId;
  }

  ionViewDidLoad() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
