import { Injectable } from "@angular/core";
import { PriceTrackerService } from "@arkecosystem/platform-sdk-markets";
import { from, Observable } from "rxjs";

import { MarketData } from "./market.types";

@Injectable({ providedIn: "root" })
export class MarketService {
	constructor() {}

	/* istanbul ignore next */
	public verifyToken(token: string): Observable<boolean> {
		return from(PriceTrackerService.make("coincap").verifyToken(token));
	}

	/* istanbul ignore next */
	public getMarket(token: string): Observable<Record<string, MarketData>> {
		return from(PriceTrackerService.make("coincap").marketData(token));
	}

	/* istanbul ignore next */
	public getDailyAverage(
		token: string,
		currency: string,
		timestamp: number,
	): Observable<number> {
		return from(
			PriceTrackerService.make("coincap").dailyAverage(
				token,
				currency,
				timestamp,
			),
		);
	}
}
