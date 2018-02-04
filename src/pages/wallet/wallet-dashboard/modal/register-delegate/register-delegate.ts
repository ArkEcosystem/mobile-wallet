import {Component, OnDestroy} from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import lodash from 'lodash';

@IonicPage()
@Component({
  selector: 'page-register-delegate',
  templateUrl: 'register-delegate.html',
})
export class RegisterDelegatePage implements OnDestroy {

  public fee: number;
  public symbol: string;
  public name: string;

  public allowedDelegateNameChars = '[a-z0-9!@$&_.]+';
  public isExists = false;

  private delegates;
  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private arkApiProvider: ArkApiProvider,
  ) {
    this.arkApiProvider.fees.subscribe((fees) => this.fee = fees.delegate);
    this.symbol = this.arkApiProvider.network.symbol;

    this.arkApiProvider.delegates.takeUntil(this.unsubscriber$).subscribe((delegates) => this.delegates = delegates);
  }

  validateName() {
    this.name = this.name.toLowerCase();
    const find = lodash.find(this.delegates, { username: this.name.trim() });

    this.isExists = !lodash.isNil(find);
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  submitForm() {
    this.viewCtrl.dismiss(this.name);
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
