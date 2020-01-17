import { NgModule } from "@angular/core";
import { HeaderScrollerDirective } from "./header-scroller/header-scroller";
import { MarketNetOnlyDirective } from "./marketnet-only/marketnet-only";

@NgModule({
	declarations: [MarketNetOnlyDirective, HeaderScrollerDirective],
	imports: [],
	exports: [MarketNetOnlyDirective, HeaderScrollerDirective],
})
export class DirectivesModule {}
