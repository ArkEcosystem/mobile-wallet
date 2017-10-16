import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

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

  private _setPeer(): void {
    this.api.peer.list().subscribe((response) => {
      if (response) {
        let sortHeight = lodash(response.peers).filter({'status': 'OK', 'port': this.network.activePeer.port}).orderBy(['height','delay'], ['desc','asc']);
        this.network.setPeer(sortHeight.value()[0]);
        this.api = new arkts.Client(this.network);
      }
      this._setFees();
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
