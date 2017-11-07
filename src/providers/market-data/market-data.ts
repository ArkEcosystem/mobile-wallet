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

  public onUpdateHistory$: Subject<model.MarketHistory> = new Subject<model.MarketHistory>();
  public onUpdateTicker$: Subject<model.MarketTicker> = new Subject<model.MarketTicker>();

  constructor(
    private http: Http,
    private storageProvider: StorageProvider,
  ) {
    this.refreshPrice();
    this.fetchHistory().subscribe((history) => this.onUpdateHistory$.next(history));
  }

  public refreshPrice(): void {
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

  private fetchHistory() {
    const url = `${constants.API_MARKET_URL}/${constants.API_MARKET_HISTORY_ENDPOINT}`;
    return this.http.get(url).map((response) => {
      let json = response.json();
      return new model.MarketHistory().deserialize(json.history);
    });
  }

}
