import { NgModule } from '@angular/core';
import { TruncateMiddlePipe } from './../pipes/truncate-middle/truncate-middle';
import { UnitsSatoshiPipe } from './../pipes/units-satoshi/units-satoshi';

@NgModule({
	declarations: [TruncateMiddlePipe,
    UnitsSatoshiPipe],
	imports: [],
	exports: [TruncateMiddlePipe,
    UnitsSatoshiPipe]
})
export class PipesModule {}
