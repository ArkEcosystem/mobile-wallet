import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { UserDataProvider } from '@providers/user-data/user-data';

import * as arkts from 'ark-ts';
import lodash from 'lodash';

@Injectable()
export class ArkApiProvider {

  private network: arkts.Network;
  private http: arkts.Http;
  private client: arkts.Client;

  public fees: arkts.Fees;
  public api: arkts.Client;

  constructor(public userDataProvider: UserDataProvider) {
    this.userDataProvider.networkActiveObserver.subscribe((network) => {
      this.network = network;

      if (lodash.isEmpty(network)) {
        this.api = null;
      } else {
        this.http = new arkts.Http(network);
        this.client = new arkts.Client(network);

        this.api = this.client;
        this._setPeer();
      }
    });
  }

  private _setPeer(): void {
    this.api.peer.findGoodPeer().subscribe((response) => {
      if (response) {
        this.network.activePeer = response;
        this._setFees();
      }
    });
  }

  private _setFees(): void {
    arkts.BlockApi.networkFees(this.network).subscribe((response) => {
      if (response && response.success) {
        this.fees = response.fees;
      }
    });
  }

}
