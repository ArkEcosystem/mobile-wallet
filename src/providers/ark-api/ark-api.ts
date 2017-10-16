import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/repeat';

import { UserDataProvider } from '@providers/user-data/user-data';

import * as arkts from 'ark-ts';
import lodash from 'lodash';

@Injectable()
export class ArkApiProvider {

  public network: arkts.Network;
  public fees: arkts.Fees;
  public api: arkts.Client;

  constructor(public userDataProvider: UserDataProvider) {
    this.userDataProvider.networkActiveObserver.subscribe((network) => {
      this.network = network;
      if (lodash.isEmpty(network)) {
        this.api = null;
      } else {
        this.api = new arkts.Client(this.network);
        this._setPeer();
      }
    });
  }

  public getAllDelegates() {
    if (!this.api) return;

    const limit = 51;

    let totalCount = limit;
    let offset, currentPage;
    offset = currentPage = 0;

    let totalPages = totalCount / limit;

    let delegates = [];

    this.api.delegate.list({ limit, offset }).expand((project) => {
      let req = this.api.delegate.list({ limit, offset });
      return currentPage < totalPages ? req : Observable.empty();
    }).do((response) => {
      offset += limit;
      if (response.success) totalCount = response.totalCount;
      totalPages = Math.ceil(totalCount / limit);

      currentPage++;
    }).finally(() => {
      // TODO:
    }).subscribe((data) => {
      if (data.success) delegates = [...delegates, ...data.delegates];
    });
  }

  private _setPeer(): void {
    // Get list from active peer
    this.api.peer.list().subscribe((response) => {
      if (response) {
        let port = this.network.activePeer.port;
        let sortHeight = lodash.orderBy(lodash.filter(response.peers, {'status': 'OK', 'port': port}), ['height','delay'], ['desc','asc']);

        this.network.setPeer(sortHeight[0]);
      }
    },
    // Get list from file
    () => {
      return arkts.PeerApi.findGoodPeer(this.network).first().subscribe((peer) => this._updateNetwork(peer));
    }, () => this._updateNetwork());
  }

  private _updateNetwork(peer?: arkts.Peer) {
    if (peer) this.network.setPeer(peer);
    // Save in localStorage
    this.userDataProvider.networkUpdate(this.userDataProvider.profileActive.networkId, this.network);
    this.api = new arkts.Client(this.network);
    this._setFees();
  }

  private _setFees(): void {
    arkts.BlockApi.networkFees(this.network).subscribe((response) => {
      if (response && response.success) {
        this.fees = response.fees;
      }
    });
  }

}
