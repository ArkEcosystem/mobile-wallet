import { NgModule } from '@angular/core';
import { TruncateMiddlePipe } from './../pipes/truncate-middle/truncate-middle';
import { UnitsSatoshiPipe } from './../pipes/units-satoshi/units-satoshi';
import { MarketNumberPipe } from './../pipes/market-number/market-number';
import { AccountLabelPipe } from './../pipes/account-label/account-label';
import { EscapeHTMLPipe } from './../pipes/escape-html/escape-html';
import { HasAccountLabelPipe } from './../pipes/has-account-label/has-account-label';
import { TranslateCutPipe } from './../pipes/translate-cut/translate-cut';
import { TimestampHumanPipe } from './timestamp-human/timestamp-human';
import { TimezonePipe } from './timezone/timezone';
import { SecondsToTimePipe } from './seconds-to-time/seconds-to-time';

@NgModule({
  declarations: [TruncateMiddlePipe,
    UnitsSatoshiPipe,
    MarketNumberPipe,
    AccountLabelPipe,
    HasAccountLabelPipe,
    EscapeHTMLPipe,
    TimestampHumanPipe,
    TimezonePipe,
    SecondsToTimePipe,
    TranslateCutPipe],
  imports: [],
  exports: [TruncateMiddlePipe,
    UnitsSatoshiPipe,
    MarketNumberPipe,
    AccountLabelPipe,
    EscapeHTMLPipe,
    HasAccountLabelPipe,
    TimestampHumanPipe,
    TimezonePipe,
    SecondsToTimePipe,
    TranslateCutPipe]
})
export class PipesModule {}
