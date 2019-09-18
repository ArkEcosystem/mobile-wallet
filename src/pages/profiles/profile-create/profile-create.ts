import { Component, ViewChild, OnDestroy } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { Profile } from '@models/profile';
import { UserDataProvider } from '@providers/user-data/user-data';
import { ToastProvider } from '@providers/toast/toast';
import lodash from 'lodash';
import { Network } from 'ark-ts/model';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-profile-create',
  templateUrl: 'profile-create.html',
})
export class ProfileCreatePage implements OnDestroy {
  @ViewChild('createProfileForm') createProfileForm: HTMLFormElement;

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
    private alertCtrl: AlertController,
    private userDataProvider: UserDataProvider,
    private toastProvider: ToastProvider,
    private translateService: TranslateService
  ) { }

  onSelectNetwork(networkChoice: {name: string, id?: string}) {
    this.activeNetworkChoice = networkChoice;
    this.newProfile.networkId = networkChoice.id;
  }

  submitForm() {
    const existingProfile = this.userDataProvider.getProfileByName(this.newProfile.name);

    if (existingProfile) {
      this.showAlert('PROFILES_PAGE.PROFILENAME_ALREADY_EXISTS', {name: this.newProfile.name});
      this.createProfileForm.form.controls['name'].setErrors({incorrect: !!existingProfile});
    } else {
      const profile = new Profile();
      profile.name = this.newProfile.name;
      profile.networkId = this.newProfile.networkId;

      this.userDataProvider.addProfile(profile).takeUntil(this.unsubscriber$).subscribe(() => {
        this.navCtrl.setRoot('ProfileSigninPage');
      }, () => {
        this.toastProvider.error('PROFILES_PAGE.ADD_PROFILE_ERROR');
      });
    }
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

  private showAlert(titleKey: string, stringParams: Object) {
    this.translateService.get([titleKey, 'BACK_BUTTON_TEXT'], stringParams).subscribe((translation) => {
      const alert = this.alertCtrl.create({
        subTitle: translation[titleKey],
        buttons: [translation.BACK_BUTTON_TEXT]
      });
      alert.present();
    });
  }
}
