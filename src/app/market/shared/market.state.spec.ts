import { TestBed } from "@angular/core/testing";
import { NgxsModule, Store } from "@ngxs/store";
import { of } from "rxjs";

import { MarketActions } from "./market.actions";
import { MarketService } from "./market.service";
import { MARKET_STATE_TICKER, MarketState } from "./market.state";

const btcMarket = {
	currency: 1,
	marketCap: 0,
	volume: 0,
	price: 0.1,
	date: new Date(),
	change24h: null,
};

describe("Market State", () => {
	let store: Store;
	const marketServiceSpy = {
		getMarket: jasmine.createSpy(),
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [NgxsModule.forRoot([MarketState])],
			providers: [{ provide: MarketService, useValue: marketServiceSpy }],
		});

		store = TestBed.get(Store);
	});

	it("should add if it is not in cache", async () => {
		marketServiceSpy.getMarket.and.returnValue(
			of({
				USD: {
					currency: 0,
					marketCap: 0,
					volume: 0,
					price: 1.0,
					date: new Date(),
					change24h: null,
				},
				BTC: btcMarket,
			}),
		);
		await store
			.dispatch(new MarketActions.FetchMarket("ark", "BTC"))
			.toPromise();
		const state = store.selectSnapshot(MARKET_STATE_TICKER);
		expect(state.tickers).toEqual({
			ARK: {
				BTC: btcMarket,
			},
		});
	});

	it("should get from cache", async () => {
		marketServiceSpy.getMarket.and.returnValue(
			of({
				BTC: btcMarket,
			}),
		);
		await store
			.dispatch(new MarketActions.FetchMarket("ark", "BTC"))
			.toPromise();

		marketServiceSpy.getMarket.and.returnValue(
			of({
				BTC: {
					...btcMarket,
					price: 10.2,
				},
			}),
		);
		await store
			.dispatch(new MarketActions.FetchMarket("ark", "BTC"))
			.toPromise();
		const state = store.selectSnapshot(MarketState.getMarket("ark", "BTC"));
		expect(state).toEqual(btcMarket);
	});
});
