import { NgModule } from '@angular/core';
import { ProgressBarComponent } from './progress-bar/progress-bar';
import { EmptyListComponentModule } from './empty-list/empty-list.module';

@NgModule({
	declarations: [ProgressBarComponent],
	imports: [],
	exports: [ProgressBarComponent, EmptyListComponentModule]
})
export class ComponentsModule {}
