import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { Observable, Subject } from 'rxjs';
import 'rxjs/add/operator/takeUntil';

import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { TranslateService } from '@ngx-translate/core';

import { Network, Peer, PeerResponse } from 'ark-ts';

import * as constants from '@app/app.constants';

@IonicPage()
@Component({
  selector: 'page-network-status',
  templateUrl: 'network-status.html',
})
export class NetworkStatusPage {

  public currentNetwork: Network;
  public currentPeer: Peer;

  private _subscriber: Observable<PeerResponse>;
  private _unsubscriber: Subject<void> = new Subject<void>();

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _arkApiProvider: ArkApiProvider,
    private _loadingCtrl: LoadingController,
    private _translateService: TranslateService,
  ) { }

  load() {
    this.currentNetwork = this._arkApiProvider.network;
    this.currentPeer = this._arkApiProvider.network.activePeer;

    this._subscriber = this._arkApiProvider.api.peer.get(this.currentPeer.ip, this.currentPeer.port)
      .takeUntil(this._unsubscriber)
      .do((response) => {
        if (response && response.success) {
          this.currentPeer = response.peer;
        }
      });

    this._translateService.get('Getting data...').takeUntil(this._unsubscriber).subscribe((translation) => {
      let loader = this._loadingCtrl.create({
        content: translation,
      });

      this._subscriber.finally(() => {
        loader.dismiss();
        this.refreshStatus();
      }).subscribe(null, () => {
        // TODO: Toast error
      });

      loader.present();
    });
  }

  refreshStatus() {
    setInterval(() => {
      this._subscriber.subscribe();
    }, constants.WALLET_REFRESH_TRANSACTIONS_MILLISECONDS);
  }

  ionViewDidLoad() {
    this.load();
  }

  ngOnDestroy() {
    this._unsubscriber.next();
    this._unsubscriber.complete();
  }

}
