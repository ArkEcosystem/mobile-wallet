import { OnDestroy, Pipe, PipeTransform } from "@angular/core";
import { Subject } from "rxjs";
import { finalize, takeUntil, tap } from "rxjs/operators";

import { MarketCurrency, MarketTicker } from "@/models/model";
import { UserSettings } from "@/models/settings";
import { MarketDataProvider } from "@/services/market-data/market-data";
import { SettingsDataProvider } from "@/services/settings-data/settings-data";
import { SafeBigNumber as BigNumber } from "@/utils/bignumber";

@Pipe({
	name: "marketNumber",
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
			.pipe(
				tap((ticker) => (this.marketTicker = ticker)),
				finalize(() =>
					this.settingsDataProvider.settings.subscribe((settings) =>
						this.updateCurrency(settings),
					),
				),
			)
			.subscribe();

		this.settingsDataProvider.onUpdate$
			.pipe(takeUntil(this.unsubscriber$))
			.subscribe((settings) => this.updateCurrency(settings));
		this.marketDataProvider.onUpdateTicker$
			.pipe(takeUntil(this.unsubscriber$))
			.subscribe((ticker) => (this.marketTicker = ticker));
	}

	transform(value: number | string, forceCurrency?: MarketCurrency) {
		if (value === null) {
			return;
		}

		const currency = forceCurrency || this.marketCurrency;
		if (!currency) {
			return;
		}

		const trueValue = new BigNumber(value.toString());
		let decimalPlaces = 2;

		if (currency && currency.code === "btc") {
			decimalPlaces = 8;
		}

		return trueValue.toNumber().toFixed(decimalPlaces);
	}

	ngOnDestroy() {
		this.unsubscriber$.next();
		this.unsubscriber$.complete();
	}

	private updateCurrency(settings: UserSettings) {
		if (!this.marketTicker) {
			return;
		}

		this.marketCurrency = this.marketTicker.getCurrency({
			code: settings.currency,
		});
	}
}
