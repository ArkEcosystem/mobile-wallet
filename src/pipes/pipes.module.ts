import { NgModule } from '@angular/core';
import { TruncateMiddlePipe } from './../pipes/truncate-middle/truncate-middle';
import { UnitsSatoshiPipe } from './../pipes/units-satoshi/units-satoshi';
import { AccountLabelPipe } from './../pipes/account-label/account-label';

@NgModule({
	declarations: [TruncateMiddlePipe,
    UnitsSatoshiPipe,
    AccountLabelPipe],
	imports: [],
	exports: [TruncateMiddlePipe,
    UnitsSatoshiPipe,
    AccountLabelPipe]
})
export class PipesModule {}
