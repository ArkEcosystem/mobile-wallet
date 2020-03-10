import { NgModule } from "@angular/core";

import { HeaderScrollerDirective } from "./header-scroller/header-scroller";
import { MarketNetOnlyDirective } from "./marketnet-only/marketnet-only";
import { PasteClipboardValueDirective } from "./paste-clipboard-value/paste-clipboard-value";
import { ValueMaskOnBlurDirective } from "./value-mask-on-blur/value-mask-on-blur";

@NgModule({
	declarations: [
		MarketNetOnlyDirective,
		HeaderScrollerDirective,
		ValueMaskOnBlurDirective,
		PasteClipboardValueDirective,
	],
	imports: [],
	exports: [
		MarketNetOnlyDirective,
		HeaderScrollerDirective,
		ValueMaskOnBlurDirective,
		PasteClipboardValueDirective,
	],
})
export class DirectivesModule {}
