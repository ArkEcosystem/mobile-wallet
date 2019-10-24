import {Component, OnDestroy} from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';

import { Subject } from 'rxjs';
import { ArkApiProvider } from '@/services/ark-api/ark-api';
import lodash from 'lodash';
import { TransactionType } from 'ark-ts/model';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'page-register-delegate',
  templateUrl: 'register-delegate.html',
  styleUrls: ['register-delegate.scss']
})
export class RegisterDelegatePage implements OnDestroy {
  public fee: number;
  public symbol: string;
  public name: string;

  public allowedDelegateNameChars = '[a-z0-9!@$&_.]+';
  public isExists = false;
  public transactionType = TransactionType.CreateDelegate;

  private delegates;
  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private arkApiProvider: ArkApiProvider,
  ) {
    this.symbol = this.arkApiProvider.network.symbol;

    this.arkApiProvider.delegates.pipe(
      takeUntil(this.unsubscriber$)
    ).subscribe((delegates) => this.delegates = delegates);
  }

  validateName() {
    this.name = this.name.toLowerCase();
    const find = lodash.find(this.delegates, { username: this.name.trim() });

    this.isExists = !lodash.isNil(find);
  }

  onFeeChange(newFee: number) {
    this.fee = newFee;
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  submitForm() {
    this.modalCtrl.dismiss({ name: this.name, fee: this.fee });
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
