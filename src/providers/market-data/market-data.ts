import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { StorageProvider } from '@providers/storage/storage';

import * as model from '@models/market';
import * as constants from '@app/app.constants';

@Injectable()
export class MarketDataProvider {

  public ticker;
  public history;

  constructor(public http: Http, public storageProvider: StorageProvider) {
    this.getApiTicker().subscribe((ticker) => {
      console.log(ticker);
    });
    this.getApiHistory();
  }

  private getApiTicker(): Observable<model.MarketTicker> {
    const url = `${constants.API_MARKET_URL}/${constants.API_MARKET_TICKER_ENDPOINT}`;

    return this.http.get(url).map((response) => {
      let json = response.json();
      return new model.MarketTicker().deserialize(json);
    });
  }

  private getApiHistory() {
    const url = `${constants.API_MARKET_URL}/${constants.API_MARKET_HISTORY_ENDPOINT}`;
    return this.http.get(url).map((response) => {
      let json = response.json();
      console.log(json);
      return new model.MarketHistory().deserialize(json.history);
    }).subscribe((response) => {
      console.log(response);
    });
  }

}
