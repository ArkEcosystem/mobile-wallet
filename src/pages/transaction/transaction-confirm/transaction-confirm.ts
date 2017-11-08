import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { MarketDataProvider } from '@providers/market-data/market-data';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';
import { Transaction, MarketTicker, MarketCurrency } from '@models/model';

import { Network } from 'ark-ts/model';

@IonicPage()
@Component({
  selector: 'page-transaction-confirm',
  templateUrl: 'transaction-confirm.html',
})
export class TransactionConfirmPage {

  public transaction: Transaction;
  public address: string;

  public marketCurrency: MarketCurrency;
  public ticker: MarketTicker;
  public currentNetwork: Network;

  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private arkApiProvider: ArkApiProvider,
    private marketDataProvidfer: MarketDataProvider,
    private settingsDataProvider: SettingsDataProvider,
  ) {
    let transaction = this.navParams.get('transaction');
    let passphrases = this.navParams.get('passphrases');
    this.address = this.navParams.get('address');

    if (!transaction || !passphrases || !this.address) this.navCtrl.pop();

    transaction = new Transaction(this.address).deserialize(transaction);
    this.arkApiProvider.createTransaction(transaction, passphrases['passphrase'], passphrases['secondPassphrase']).subscribe((tx) => {
      this.transaction = tx;
    }, () => {
      // TODO: Handle the error
    });

    this.currentNetwork = this.arkApiProvider.network;
  }

  broadcast() {
    this.arkApiProvider.postTransaction(this.transaction)
      .subscribe((response) => {
        this.dismiss(true);
      }, (error) => {
        // TODO: Toast message
        this.dismiss(false, error);
      });
  }

  dismiss(status?: boolean, message?: string) {
    if (!status && !message) return this.viewCtrl.dismiss();

    let response = { status, message, transaction: this.transaction };
    this.viewCtrl.dismiss(response);
  }

  private onUpdateTicker() {
    this.marketDataProvidfer.onUpdateTicker$.takeUntil(this.unsubscriber$).do((ticker) => {
      if (!ticker) return;

      this.ticker = ticker;
      this.settingsDataProvider.settings.subscribe((settings) => {
        this.marketCurrency = this.ticker.getCurrency({ code: settings.currency });
      });
    }).subscribe();
  }

  ionViewDidLoad() {
    this.onUpdateTicker();
    this.marketDataProvidfer.refreshPrice();
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
