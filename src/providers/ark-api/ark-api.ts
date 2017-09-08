import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { LocalDataProvider } from '@providers/local-data/local-data';

import * as arkts from 'ark-ts';

@Injectable()
export class ArkApiProvider {

  private http: arkts.Http;
  private client: arkts.Client;

  constructor(public localDataProvider: LocalDataProvider) { }

  api(): arkts.Client {
    let network = this.localDataProvider.networkActive();

    if (this.client && this.http.network.type == network.type) {
      return this.client;
    }

    this.http = new arkts.Http(network);
    this.client = new arkts.Client(network);

    return this.client;
  }

}
