import { Injectable } from "@angular/core";
import {
	Action,
	createSelector,
	State,
	StateContext,
	StateToken,
} from "@ngxs/store";
import { produce } from "immer";
import { pluck, tap } from "rxjs/operators";

import { MarketActions } from "./market.actions";
import { MarketConfig } from "./market.config";
import { MarketService } from "./market.service";
import { MarketCurrency, MarketData } from "./market.types";

export interface MarketStateModel {
	tickers: Record<string, Record<string, MarketData>>;
}

export const MARKET_STATE_TICKER = new StateToken<MarketStateModel>(
	MarketConfig.STORAGE_KEY,
);

@State<MarketStateModel>({
	name: MarketConfig.STORAGE_KEY,
	defaults: {
		tickers: {},
	},
})
@Injectable()
export class MarketState {
	constructor(private marketService: MarketService) {}

	static getMarket(token: string, currency: MarketCurrency) {
		return createSelector(
			[MarketState],
			(state: MarketStateModel) =>
				state.tickers[token.toUpperCase()]?.[currency.toUpperCase()],
		);
	}

	@Action(MarketActions.FetchMarket)
	public fetchMarket(
		ctx: StateContext<MarketStateModel>,
		action: MarketActions.FetchMarket,
	) {
		const { tickers } = ctx.getState();
		const token = action.token.toUpperCase();
		const currency = action.currency.toUpperCase();

		// TODO: Check the date to determine if it should be cached
		if (tickers[token]?.[currency]) {
			return;
		}

		return this.marketService.getMarket(token).pipe(
			pluck(currency),
			tap((marketData) => {
				ctx.setState(
					produce((draft) => {
						const draftToken = draft.tickers[token] || {};
						draftToken[currency] = marketData;
						draft.tickers[token] = draftToken;
					}),
				);
			}),
		);
	}
}
