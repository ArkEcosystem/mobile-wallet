import { Injectable } from "@angular/core";
import { PriceTrackerService } from "@arkecosystem/platform-sdk";
import { from } from "rxjs";

@Injectable()
export class MarketService {
	constructor() {}

	public verifyToken(token: string) {
		return from(PriceTrackerService.make("coincap").verifyToken(token));
	}

	public getMarketData(token: string) {
		return from(PriceTrackerService.make("coincap").marketData(token));
	}
}
