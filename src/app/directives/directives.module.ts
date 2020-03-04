import { NgModule } from "@angular/core";
import { HeaderScrollerDirective } from "./header-scroller/header-scroller";
import { MarketNetOnlyDirective } from "./marketnet-only/marketnet-only";
import { ValueMaskOnBlurDirective } from "./value-mask-on-blur/value-mask-on-blur";

@NgModule({
	declarations: [
		MarketNetOnlyDirective,
		HeaderScrollerDirective,
		ValueMaskOnBlurDirective,
	],
	imports: [],
	exports: [
		MarketNetOnlyDirective,
		HeaderScrollerDirective,
		ValueMaskOnBlurDirective,
	],
})
export class DirectivesModule {}
