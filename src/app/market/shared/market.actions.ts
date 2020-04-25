import { Currency } from "./market.types";

export namespace MarketActions {
	export class GetMarketByToken {
		static readonly type = "[Market] Get Market by ticker";
		constructor(public token: string, public currency: Currency) {}
	}
}
