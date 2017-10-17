import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable, BehaviorSubject, Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';

import { StorageProvider } from '@providers/storage/storage';

import * as model from '@models/market';
import * as constants from '@app/app.constants';

@Injectable()
export class MarketDataProvider {

  public historyObserver: BehaviorSubject<model.MarketHistory> = new BehaviorSubject(null);
  public tickerObserver: BehaviorSubject<model.MarketTicker> = new BehaviorSubject(null);

  private _unsubscriber$: Subject<void> = new Subject<void>();

  constructor(private _http: Http, private _storageProvider: StorageProvider) {
    this.refreshPrice();
    this._fetchHistory().takeUntil(this._unsubscriber$).subscribe((history) => this.historyObserver.next(history));
  }

  public refreshPrice(): void {
    this._fetchTicker().takeUntil(this._unsubscriber$).subscribe((ticker) => {
      this.tickerObserver.next(ticker);
    });
  }

  private _fetchTicker(): Observable<model.MarketTicker> {
    const url = `${constants.API_MARKET_URL}/${constants.API_MARKET_TICKER_ENDPOINT}`;

    return this._http.get(url).map((response) => {
      let json = response.json();
      return new model.MarketTicker().deserialize(json);
    });
  }

  private _fetchHistory() {
    const url = `${constants.API_MARKET_URL}/${constants.API_MARKET_HISTORY_ENDPOINT}`;
    return this._http.get(url).map((response) => {
      let json = response.json();
      return new model.MarketHistory().deserialize(json.history);
    });
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

}
