import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/mergeMap';

import { StorageProvider } from '@providers/storage/storage';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';

import * as model from '@models/market';
import { UserSettings } from '@models/settings';
import * as constants from '@app/app.constants';
import { UserDataProvider } from '@providers/user-data/user-data';

@Injectable()
export class MarketDataProvider {

  public onUpdateTicker$: Subject<model.MarketTicker> = new Subject<model.MarketTicker>();
  public onUpdateHistory$: Subject<model.MarketHistory> = new Subject<model.MarketHistory>();

  private settings: UserSettings;
  private marketTicker: model.MarketTicker;
  private marketHistory: model.MarketHistory;

  private get marketTickerName(): string {
    return this.userDataProvider.currentNetwork.marketTickerName || 'ARK';
  }

  constructor(
    private http: HttpClient,
    private storageProvider: StorageProvider,
    private settingsDataProvider: SettingsDataProvider,
    private userDataProvider: UserDataProvider
  ) {
    this.loadData();
    this.fetchTicker();

    settingsDataProvider.settings.subscribe((settings) => {
      this.settings = settings;
      this.fetchHistory();
    });

    this.onUpdateSettings();
  }

  get history(): Observable<model.MarketHistory> {
    if (this.marketHistory) { return Observable.of(this.marketHistory); }

    return this.fetchHistory();
  }

  get cachedHistory(): model.MarketHistory {
     return this.marketHistory;
  }

  get ticker(): Observable<model.MarketTicker> {
    if (this.marketTicker) { return Observable.of(this.marketTicker); }

    return this.fetchTicker();
  }

  get cachedTicker(): model.MarketTicker {
     return this.marketTicker;
  }

  refreshTicker(): void {
    this.fetchTicker().subscribe((ticker) => {
      this.onUpdateTicker$.next(ticker);
    });
  }

  private fetchTicker(): Observable<model.MarketTicker> {
    const url = `${constants.API_MARKET_URL}/data/pricemultifull?fsyms=${this.marketTickerName}&tsyms=`;

    const currenciesList = model.CURRENCIES_LIST.map((currency) => {
      return currency.code.toUpperCase();
    }).join(',');

    return this.http.get(url + currenciesList).map((response) => {
      const json = response['RAW'][this.marketTickerName] || response['RAW'][this.marketTickerName.toUpperCase()];
      const tickerObject = {
        symbol: json['BTC']['FROMSYMBOL'],
        currencies: json,
      };

      this.marketTicker = new model.MarketTicker().deserialize(tickerObject);
      this.storageProvider.set(this.getKey(constants.STORAGE_MARKET_TICKER), tickerObject);

      return this.marketTicker;
    });
  }

  fetchHistory(): Observable<model.MarketHistory> {
    const url = `${constants.API_MARKET_URL}/data/histoday?fsym=${this.marketTickerName}&allData=true&tsym=`;
    const myCurrencyCode = ((!this.settings || !this.settings.currency)
      ? this.settingsDataProvider.getDefaults().currency
      : this.settings.currency).toUpperCase();
    return this.http.get(url + 'BTC')
      .map((btcResponse) => btcResponse)
      .flatMap((btcResponse) => this.http.get(url + myCurrencyCode).map((currencyResponse) => {
        const historyData = {
          BTC: btcResponse['Data'],
        };
        historyData[myCurrencyCode] = currencyResponse['Data'];
        const history = new model.MarketHistory().deserialize(historyData);

        this.marketHistory = history;
        this.storageProvider.set(this.getKey(constants.STORAGE_MARKET_HISTORY), historyData);
        this.onUpdateHistory$.next(history);

        return history;
      }));
  }

  private onUpdateSettings() {
    this.settingsDataProvider.onUpdate$.subscribe((settings) => {
      this.settings = settings;
      this.marketHistory = null;
    });
  }

  private loadData() {
    this.storageProvider.getObject(this.getKey(constants.STORAGE_MARKET_HISTORY)).subscribe((history) => {
      if (history) {
        this.marketHistory = new model.MarketHistory().deserialize(history);
      }
    });
    this.storageProvider.getObject(this.getKey(constants.STORAGE_MARKET_TICKER)).subscribe((ticker) => {
      if (ticker) {
        this.marketTicker = new model.MarketTicker().deserialize(ticker);
      }
    });
  }

  private getKey(key: string): string {
    return key + ':' + this.marketTickerName;
  }
}
