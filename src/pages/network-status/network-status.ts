import {Component, NgZone, OnDestroy} from '@angular/core';
import { IonicPage, LoadingController } from 'ionic-angular';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/debounceTime';

import { ArkApiProvider } from '@providers/ark-api/ark-api';

import { Network, Peer } from 'ark-ts';

import { TranslateService } from '@ngx-translate/core';
import { ToastProvider } from '@providers/toast/toast';

@IonicPage()
@Component({
  selector: 'page-network-status',
  templateUrl: 'network-status.html',
})
export class NetworkStatusPage implements OnDestroy {

  public currentNetwork: Network;
  public currentPeer: Peer;

  private unsubscriber$: Subject<void> = new Subject<void>();

  private refreshIntervalListener;
  private loader;

  constructor(
    private arkApiProvider: ArkApiProvider,
    private loadingCtrl: LoadingController,
    private zone: NgZone,
    private translateService: TranslateService,
    private toastProvider: ToastProvider,
  ) {
    this.currentNetwork = this.arkApiProvider.network;
    this.currentPeer = this.currentNetwork.activePeer;
  }

  getPeerUrl() {
    return `http://${this.currentPeer.ip}:${this.currentPeer.port}`;
  }

  changePeer() {
    this.translateService.get('NETWORKS_PAGE.LOOKING_GOOD_PEER').debounceTime(500).subscribe((translate) => {
      this.loader = this.loadingCtrl.create({
        content: translate,
        duration: 10000
      });

      this.arkApiProvider.findGoodPeer();
      this.loader.present();
    });
  }

  resetToSeed() {
    this.translateService.get('NETWORKS_PAGE.LOOKING_GOOD_PEER').debounceTime(500).subscribe((translation) => {
      this.loader = this.loadingCtrl.create({
        content: translation,
        duration: 10000
      });

      this.arkApiProvider.findGoodSeedPeer().then(success => {
        if (!success) {
          this.loader.dismiss();
          this.toastProvider.error('NETWORKS_PAGE.NO_GOOD_PEER');
        }
      });
      this.loader.present();
    });
  }

  private refreshData() {
    this.arkApiProvider.client.getPeerConfig(this.currentPeer.ip, this.currentNetwork.p2pPort)
      .takeUntil(this.unsubscriber$)
      .subscribe((response) => {
        if (response) {
          this.zone.run(() => {
            this.currentPeer.version = response.data.version;
          });
        }
      });

    this.arkApiProvider.client.getPeerSyncing(this.getPeerUrl())
      .takeUntil(this.unsubscriber$)
      .subscribe((response) => {
        if (response) {
          this.zone.run(() => {
            this.currentPeer.height = response.height;
          });
        }
      });
  }

  private onUpdatePeer() {
    this.arkApiProvider.onUpdatePeer$
      .takeUntil(this.unsubscriber$)
      .do((peer) => {
        if (this.loader) { this.loader.dismiss(); }
        this.translateService.get('NETWORKS_PAGE.PEER_SUCCESSFULLY_CHANGED')
          .subscribe((translate) => this.toastProvider.success(translate));
        this.zone.run(() => this.currentPeer = peer);
        this.refreshData();
      }).subscribe();
  }

  ionViewDidLoad() {
    this.onUpdatePeer();
    this.refreshData();

    this.refreshIntervalListener = setInterval(() => {
      this.refreshData();
    }, 30 * 1000);
  }

  ngOnDestroy() {
    clearInterval(this.refreshIntervalListener);

    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
