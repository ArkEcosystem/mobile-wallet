import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable, Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';

import { StorageProvider } from '@providers/storage/storage';

import * as model from '@models/market';
import * as constants from '@app/app.constants';

@Injectable()
export class MarketDataProvider {

  public onUpdateTicker$: Subject<model.MarketTicker> = new Subject<model.MarketTicker>();

  private marketTicker: model.MarketTicker;
  private marketHistory: model.MarketHistory;

  constructor(
    private http: Http,
    private storageProvider: StorageProvider,
  ) {
    this.loadData();

    // Update at start
    this.fetchHistory();
    this.fetchTicker();
  }

  get history(): Observable<model.MarketHistory> {
    if (this.marketHistory) return Observable.of(this.marketHistory);

    return this.fetchHistory();
  }

  get ticker(): Observable<model.MarketTicker> {
    if (this.marketTicker) return Observable.of(this.marketTicker);

    return this.fetchTicker();
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
      this.storageProvider.set(constants.STORAGE_MARKET_TICKER, json);

      return new model.MarketTicker().deserialize(json);
    });
  }

  fetchHistory(): Observable<model.MarketHistory> {
    const url = `${constants.API_MARKET_URL}/${constants.API_MARKET_HISTORY_ENDPOINT}`;

    return this.http.get(url).map((response) => {
      let json = response.json();
      let history = new model.MarketHistory().deserialize(json.history);

      this.marketHistory = history;
      this.storageProvider.set(constants.STORAGE_MARKET_HISTORY, json.history);

      return history;
    });
  }

  private loadData() {
    this.storageProvider.getObject(constants.STORAGE_MARKET_HISTORY).subscribe((history) => {
      this.marketHistory = new model.MarketHistory().deserialize(history);
    });

    this.storageProvider.getObject(constants.STORAGE_MARKET_TICKER).subscribe((ticker) => {
      this.marketTicker = new model.MarketTicker().deserialize(ticker);
    })
  }

}
