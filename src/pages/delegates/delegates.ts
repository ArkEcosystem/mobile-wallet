import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { Delegate, Network } from 'ark-ts';

import * as constants from '@app/app.constants';

@IonicPage()
@Component({
  selector: 'page-delegates',
  templateUrl: 'delegates.html',
})
export class DelegatesPage {

  public isSearch: boolean = false;
  public searchQuery: string;
  public delegates: Delegate[];
  public supply: number = 0;
  public preMinned: number = constants.BLOCKCHAIN_PREMINNED;
  public currentNetwork: Network;

  private unsubscriber$: Subject<void> = new Subject<void>();
  private refreshListener;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private arkApiProvider: ArkApiProvider,
    private zone: NgZone,
  ) {
    this.currentNetwork = this.arkApiProvider.network;
    this.arkApiProvider.delegates.subscribe((data) => {
      this.zone.run(() => this.delegates = data);
    });
    this.getSupply();
  }

  toggleSearchBar() {
    this.isSearch = !this.isSearch;
  }

  onInputSearch(evt) {

  }

  getTotalForged() {
    let forged = this.supply === 0 ? 0 : this.supply - this.preMinned;

    return forged;
  }

  private getSupply() {
    this.arkApiProvider.api.block.blockchainStatus().takeUntil(this.unsubscriber$).subscribe((data) => {
      if (data.success) {
        this.zone.run(() => this.supply = data.supply);
      }
    })
  }

  private onUpdateDelegates() {
    this.arkApiProvider.onUpdateDelegates$
      .takeUntil(this.unsubscriber$)
      .do((delegates) => {
        this.zone.run(() => this.delegates = delegates)
      })
      .subscribe();
  }

  ionViewDidLoad() {
    this.onUpdateDelegates();
    this.refreshListener = setInterval(() => {
      this.getSupply();
    }, constants.WALLET_REFRESH_TRANSACTIONS_MILLISECONDS);
  }

  ngOnDestroy() {
    clearInterval(this.refreshListener);

    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
