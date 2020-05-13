import { Injectable } from "@angular/core";
import { MarketService as MarketSDK } from "@arkecosystem/platform-sdk-markets";
import { from, Observable } from "rxjs";

import { MarketData } from "./market.types";

@Injectable({ providedIn: "root" })
export class MarketService {
	constructor() {}

	/* istanbul ignore next */
	public verifyToken(token: string): Observable<boolean> {
		return from(MarketSDK.construct("coincap").verifyToken(token));
	}

	/* istanbul ignore next */
	public getMarket(token: string): Observable<Record<string, MarketData>> {
		return from(MarketSDK.construct("coincap").marketData(token));
	}

	/* istanbul ignore next */
	public getDailyAverage(
		token: string,
		currency: string,
		timestamp: number,
	): Observable<number> {
		return from(
			MarketSDK.construct("coincap").dailyAverage(
				token,
				currency,
				timestamp,
			),
		);
	}
}
