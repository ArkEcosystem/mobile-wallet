import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable, Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';

import { StorageProvider } from '@providers/storage/storage';

import * as model from '@models/market';
import * as constants from '@app/app.constants';
import { MarketHistory } from '@models/model';
import { observeOn } from 'rxjs/operators/observeOn';

@Injectable()
export class MarketDataProvider {

  public onUpdateTicker$: Subject<model.MarketTicker> = new Subject<model.MarketTicker>();

  private marketHistory: MarketHistory;

  constructor(
    private http: Http,
    private storageProvider: StorageProvider,
  ) {
    this.refreshPrice();
  }

  get history(): Observable<MarketHistory> {
    if (this.marketHistory) return Observable.of(this.marketHistory);

    return this.fetchHistory();
  }

  refreshPrice(): void {
    this.fetchTicker().subscribe((ticker) => {
      this.onUpdateTicker$.next(ticker);
    });
  }

  private fetchTicker(): Observable<model.MarketTicker> {
    const url = `${constants.API_MARKET_URL}/${constants.API_MARKET_TICKER_ENDPOINT}`;

    return this.http.get(url).map((response) => {
      let json = response.json();
      return new model.MarketTicker().deserialize(json);
    });
  }

  private fetchHistory(): Observable<MarketHistory> {
    const url = `${constants.API_MARKET_URL}/${constants.API_MARKET_HISTORY_ENDPOINT}`;

    return this.http.get(url).map((response) => {
      let json = response.json();
      let history = new model.MarketHistory().deserialize(json.history);
      this.marketHistory = history;
      return history;
    });
  }

}
