import { Pipe, PipeTransform } from '@angular/core';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';
import { MarketDataProvider } from '@providers/market-data/market-data';
import { MarketCurrency, MarketTicker } from '@models/model';
import { BigNumber } from 'bignumber.js';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Pipe({
  name: 'marketNumber',
})
export class MarketNumberPipe implements PipeTransform {
  private static marketCurrency: MarketCurrency;

  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(
    private settingsDataProvider: SettingsDataProvider,
    private marketDataProvider: MarketDataProvider,
  ) {
    this.marketDataProvider.refreshPrice();
    this.marketDataProvider.onUpdateTicker$.subscribe(
      (ticker) => this.setTicker(ticker)
    );
  }

  private setTicker(ticker: MarketTicker) {
    let updateCurrency = (settings) => {
      MarketNumberPipe.marketCurrency = ticker.getCurrency({
        code: settings.currency,
      });
    };
    this.settingsDataProvider.settings.takeUntil(this.unsubscriber$).subscribe(updateCurrency);
    this.settingsDataProvider.onUpdate$.takeUntil(this.unsubscriber$).subscribe(updateCurrency);
  }

  transform(value: number | string, forceCurrency?: MarketCurrency) {
    if (value === null) {
      return;
    }

    let currency = forceCurrency || MarketNumberPipe.marketCurrency;
    let trueValue = new BigNumber(value.toString());
    let decimalPlaces = 2;

    if (currency && currency.code === 'btc') {
      decimalPlaces = 8;
    }

    return Number(trueValue.toFixed(decimalPlaces));
  }
}
