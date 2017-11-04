import { Injectable } from '@angular/core';

import { Observable, Subject, BehaviorSubject } from 'rxjs';

import { UserDataProvider } from '@providers/user-data/user-data';
import { StorageProvider } from '@providers/storage/storage';

import * as arkts from 'ark-ts';
import lodash from 'lodash';

@Injectable()
export class ArkApiProvider {

  public onUpdatePeer$: BehaviorSubject<arkts.Peer> = new BehaviorSubject(undefined);
  public onUpdateDelegates$: BehaviorSubject<arkts.Delegate[]> = new BehaviorSubject(undefined);

  private _network: arkts.Network;
  private _api: arkts.Client;

  private _fees: arkts.Fees;
  private _delegates: arkts.Delegate[];

  constructor(private _userDataProvider: UserDataProvider, private _storageProvider: StorageProvider) {
    this._userDataProvider.onActivateNetwork$.subscribe((network) => {
      // set default peer
      if (network && !network.activePeer) {
        network.activePeer = arkts.Network.getDefault(network.type).activePeer;
      }

      this._network = network;

      if (lodash.isEmpty(network)) {
        this._api = null;
      } else {
        this._api = new arkts.Client(this._network);
        this.findGoodPeer();
      }
    });
  }

  public get network() {
    return this._network;
  }

  public get api() {
    return this._api;
  }

  public get fees() {
    return this._fees;
  }

  public get delegates(): Observable<arkts.Delegate[]> {
    if (!lodash.isEmpty(this._delegates)) return Observable.of(this._delegates);

    return this.fetchAllDelegates();
  }

  public findGoodPeer(): void {
    // Get list from active peer
    this._api.peer.list().subscribe((response) => {
      if (response) {
        let port = this._network.activePeer.port;
        let sortHeight = lodash.orderBy(lodash.filter(response.peers, {'status': 'OK', 'port': port}), ['height','delay'], ['desc','asc']);

        this._updateNetwork(sortHeight[0]);
      }
    },
    // Get list from file
    () => {
      return arkts.PeerApi.findGoodPeer(this._network).first().subscribe((peer) => this._updateNetwork(peer));
    });
  }

  public fetchAllDelegates(): Observable<arkts.Delegate[]> {
    if (!this._api) return;
    const limit = 51;

    let totalCount = limit;
    let offset, currentPage;
    offset = currentPage = 0;

    let totalPages = totalCount / limit;

    let delegates: arkts.Delegate[] = [];

    return Observable.create((observer) => {

      this._api.delegate.list({ limit, offset }).expand((project) => {
        let req = this._api.delegate.list({ limit, offset });
        return currentPage < totalPages ? req : Observable.empty();
      }).do((response) => {
        offset += limit;
        if (response.success) totalCount = response.totalCount;
        totalPages = Math.ceil(totalCount / limit);

        currentPage++;
      }).finally(() => {
        this.onUpdateDelegates$.next(delegates);

        observer.next(delegates);
        observer.complete();
      }).subscribe((data) => {
        if (data.success) delegates = [...delegates, ...data.delegates];
      });
    });

  }

  private _updateNetwork(peer?: arkts.Peer): void {
    if (peer) {
      this._network.setPeer(peer);
      this.onUpdatePeer$.next(peer);
    }
    // Save in localStorage
    this._userDataProvider.updateNetwork(this._userDataProvider.currentProfile.networkId, this._network);
    this._api = new arkts.Client(this._network);

    this.fetchAllDelegates().subscribe((data) => {
      this._delegates = data;
    });

    this._setFees();
  }

  private _setFees(): void {
    arkts.BlockApi.networkFees(this._network).subscribe((response) => {
      if (response && response.success) {
        this._fees = response.fees;
      }
    });
  }

}
