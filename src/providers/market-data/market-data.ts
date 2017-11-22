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
  private marketCurrencies: object;
  private marketCurrenciesDate?: Date;

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
    this.fetchCurrencies().subscribe((currencies) => {
      console.log('currencies', currencies);
      this.fetchTicker(currencies).subscribe((ticker) => {
        this.onUpdateTicker$.next(ticker);
      });
    });
  }

  private fetchTicker(currencies?: object): Observable<model.MarketTicker> {
    const url = `${constants.API_MARKET_TICKER_URL}/${constants.API_MARKET_TICKER_ENDPOINT}`;
    let $this = this;

    currencies = currencies || this.marketCurrencies;

    return this.http.get(url).map((response) => {
      let json = response.json()[0];

      if (currencies) {
        currencies['btc'] = json.price_btc;
        currencies['usd'] = json.price_usd;
        this.storageProvider.set(constants.STORAGE_MARKET_CURRENCIES, currencies);
      }

      this.marketTicker = new model.MarketTicker().deserialize(json, currencies);
      this.storageProvider.set(constants.STORAGE_MARKET_TICKER, json);

      return this.marketTicker;
    });
  }

  private fetchCurrencies(): Observable<object> {
    let todayDate = new Date();
    todayDate.setHours(0, 0, 0);

    if (!this.marketCurrenciesDate || (this.marketCurrenciesDate.getTime() === todayDate.getTime())) {
      return Observable.of(this.marketCurrencies);
    }

    let currenciesList = model.CURRENCIES_LIST.map((currency) => {
      return currency.code.toUpperCase();
    }).join(',');
    let currenciesUrl = `${constants.API_CURRENCY_TICKER_URL}/${constants.API_CURRENCY_TICKER_ENDPOINT}&symbols=${currenciesList}`;

    return this.http.get(currenciesUrl).map((currenciesResponse) => {
      let currenciesJson = currenciesResponse.json();
      let currencies = {};
      for (let currency in currenciesJson.rates) {
        currencies[currency.toLowerCase()] = currenciesJson.rates[currency];
      }

      this.marketCurrencies = currencies;
      this.storageProvider.set(constants.STORAGE_MARKET_CURRENCIES, currencies);
      this.storageProvider.set(constants.STORAGE_MARKET_CURRENCIES_DATE, currenciesJson.date);

      return this.marketCurrencies;
    });
  }

  fetchHistory(): Observable<model.MarketHistory> {
    const url = `${constants.API_MARKET_HISTORY_URL}/${constants.API_MARKET_HISTORY_ENDPOINT}`;

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

    this.storageProvider.getObject(constants.STORAGE_MARKET_CURRENCIES).subscribe((currencies) => {
      this.marketCurrencies = currencies;
      this.storageProvider.get(constants.STORAGE_MARKET_CURRENCIES_DATE).subscribe((date) => {
        this.marketCurrenciesDate = date ? new Date(date) : null;
        this.storageProvider.getObject(constants.STORAGE_MARKET_TICKER).subscribe((ticker) => {
          this.marketTicker = new model.MarketTicker().deserialize(ticker, currencies);
        });
      });
    });
  }

}
