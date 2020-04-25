import { Injectable } from "@angular/core";
import { State } from "@ngxs/store";

import { MarketService } from "./market.service";

@State({
	name: "market",
})
@Injectable()
export class MarketState {
	constructor(private marketService: MarketService) {}
}
