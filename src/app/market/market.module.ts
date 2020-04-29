import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";

import { MarketState } from "./shared/market.state";

@NgModule({
	imports: [NgxsModule.forFeature([MarketState])],
	exports: [],
	providers: [],
})
export class MarketModule {}
