import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';

import { StorageProvider } from '@providers/storage/storage';

import * as model from '@models/market';
import * as constants from '@app/app.constants';

@Injectable()
export class MarketDataProvider {

  private history: model.MarketHistory;
  public tickerObserver: BehaviorSubject<model.MarketTicker> = new BehaviorSubject(null);

  constructor(private http: Http, private storageProvider: StorageProvider) {
    this.refreshPrice();
    this.getApiHistory().subscribe((history) => this.history = history);
  }

  getHistory(): model.MarketHistory {
    return this.history;
  }

  refreshPrice(): void {
    this.getApiTicker().subscribe((ticker) => {
      this.tickerObserver.next(ticker);
    });
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
      return new model.MarketHistory().deserialize(json.history);
    });
  }

}
