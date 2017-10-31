import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { ArkApiProvider } from '@providers/ark-api/ark-api';
import lodash from 'lodash';

@IonicPage()
@Component({
  selector: 'page-register-delegate',
  templateUrl: 'register-delegate.html',
})
export class RegisterDelegatePage {

  public fee: string;
  public symbol: string;
  public name: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private arkApiProvider: ArkApiProvider,
  ) {
    this.fee = this.navParams.get('fee');
    this.symbol = this.navParams.get('symbol');
  }

  sanitizeName() {

  }

  validateName() {
    return this.arkApiProvider.delegates.subscribe((delegates) => {
      let search = lodash.find(delegates, { username: this.name });

      return !search;
    });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  submitForm() {
    this.viewCtrl.dismiss(this.name);
  }

}
