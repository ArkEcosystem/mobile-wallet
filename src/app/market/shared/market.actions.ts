import { MarketCurrency } from "./market.types";

export namespace MarketActions {
	export class FetchMarket {
		static readonly type = "[Market] Fetch Market";
		constructor(public token: string, public currency: MarketCurrency) {}
	}
}
