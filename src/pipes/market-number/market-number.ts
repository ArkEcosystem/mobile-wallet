import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';
import { MarketDataProvider } from '@providers/market-data/market-data';
import { MarketCurrency, MarketTicker } from '@models/model';
import { BigNumber } from 'bignumber.js';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { UserSettings } from '@models/settings';

@Pipe({
  name: 'marketNumber',
})
export class MarketNumberPipe implements PipeTransform, OnDestroy {
  private marketCurrency: MarketCurrency;
  private marketTicker: MarketTicker;

  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(
    private settingsDataProvider: SettingsDataProvider,
    private marketDataProvider: MarketDataProvider,
  ) {
    this.marketDataProvider.ticker
      .do((ticker) => this.marketTicker = ticker)
      .finally(() => this.settingsDataProvider.settings.subscribe((settings) => this.updateCurrency(settings)))
      .subscribe();

    this.settingsDataProvider.onUpdate$.takeUntil(this.unsubscriber$).subscribe((settings) => this.updateCurrency(settings));
    this.marketDataProvider.onUpdateTicker$.takeUntil(this.unsubscriber$).subscribe((ticker) => this.marketTicker = ticker);
  }

  private updateCurrency(settings: UserSettings) {
    if (!this.marketTicker) { return; }

    this.marketCurrency = this.marketTicker.getCurrency({ code: settings.currency });
  }

  transform(value: number | string, forceCurrency?: MarketCurrency) {
    if (value === null) {
      return;
    }

    const currency = forceCurrency || this.marketCurrency;
    if (!currency) { return; }

    const trueValue = new BigNumber(value.toString());
    let decimalPlaces = 2;

    if (currency && currency.code === 'btc') {
      decimalPlaces = 8;
    }

    return trueValue.toNumber().toFixed(decimalPlaces);
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
}
