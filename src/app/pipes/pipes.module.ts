import { NgModule } from "@angular/core";

import { MarketDataProvider } from "@/services/market-data/market-data";

import { AccountLabelPipe } from "./../pipes/account-label/account-label";
import { EscapeHTMLPipe } from "./../pipes/escape-html/escape-html";
import { HasAccountLabelPipe } from "./../pipes/has-account-label/has-account-label";
import { MarketNumberPipe } from "./../pipes/market-number/market-number";
import { TranslateCutPipe } from "./../pipes/translate-cut/translate-cut";
import { TruncateMiddlePipe } from "./../pipes/truncate-middle/truncate-middle";
import { UnitsSatoshiPipe } from "./../pipes/units-satoshi/units-satoshi";
import { SecondsToTimePipe } from "./seconds-to-time/seconds-to-time";
import { TimestampHumanPipe } from "./timestamp-human/timestamp-human";
import { TimezonePipe } from "./timezone/timezone";

@NgModule({
	declarations: [
		TruncateMiddlePipe,
		UnitsSatoshiPipe,
		MarketNumberPipe,
		AccountLabelPipe,
		HasAccountLabelPipe,
		EscapeHTMLPipe,
		TimestampHumanPipe,
		TimezonePipe,
		SecondsToTimePipe,
		TranslateCutPipe,
	],
	imports: [],
	exports: [
		TruncateMiddlePipe,
		UnitsSatoshiPipe,
		MarketNumberPipe,
		AccountLabelPipe,
		EscapeHTMLPipe,
		HasAccountLabelPipe,
		TimestampHumanPipe,
		TimezonePipe,
		SecondsToTimePipe,
		TranslateCutPipe,
	],
	providers: [MarketDataProvider],
})
export class PipesModule {}
