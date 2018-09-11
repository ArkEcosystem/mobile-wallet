import { Component, OnDestroy, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { MarketDataProvider } from '@providers/market-data/market-data';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';
import { Transaction, MarketTicker, MarketCurrency } from '@models/model';

import { Network } from 'ark-ts/model';

import lodash from 'lodash';
import { AddressCheckResult} from '@providers/address-checker/address-check-result';
import { AddressCheckResultType } from '@providers/address-checker/address-check-result-type';

@IonicPage()
@Component({
  selector: 'modal-confirm-transaction',
  templateUrl: 'confirm-transaction.html',
})
export class ConfirmTransactionModal implements OnDestroy {

  public transaction: Transaction;
  public address: string;

  public addressCheckResult: AddressCheckResult;
  public marketCurrency: MarketCurrency;
  public ticker: MarketTicker;
  public currentNetwork: Network;
  public checkTypes = AddressCheckResultType;
  public hasBroadcast = false;

  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private arkApiProvider: ArkApiProvider,
    private marketDataProvider: MarketDataProvider,
    private settingsDataProvider: SettingsDataProvider,
    private loadingCtrl: LoadingController,
    private ngZone: NgZone,
  ) {
    this.transaction = this.navParams.get('transaction');
    this.addressCheckResult = this.navParams.get('addressCheckResult');
    this.address = this.transaction.address;

    if (!this.transaction) { this.navCtrl.pop(); }
    this.loadingCtrl.create().dismissAll();

    this.currentNetwork = this.arkApiProvider.network;
  }

  broadcast() {
    if (this.hasBroadcast) {
      return;
    }

    this.ngZone.run(() => {
      this.hasBroadcast = true;
      this.arkApiProvider.postTransaction(this.transaction)
        .subscribe(() => {
          this.dismiss(true);
        }, (error) => {
          this.dismiss(false, error.error);
        });
    });
  }

  dismiss(status?: boolean, message?: string) {
    if (lodash.isUndefined(status)) { return this.viewCtrl.dismiss(); }

    const response = { status, message };
    this.viewCtrl.dismiss(response);
  }

  private onUpdateTicker() {
    this.marketDataProvider.onUpdateTicker$.takeUntil(this.unsubscriber$).do((ticker) => {
      if (!ticker) { return; }

      this.ticker = ticker;
      this.settingsDataProvider.settings.subscribe((settings) => {
        this.marketCurrency = this.ticker.getCurrency({ code: settings.currency });
      });
    }).subscribe();
  }

  ionViewDidLoad() {
    this.onUpdateTicker();
    this.marketDataProvider.refreshTicker();
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
