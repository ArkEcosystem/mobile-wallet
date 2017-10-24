import { NgModule } from '@angular/core';
import { ProgressBarComponent } from './progress-bar/progress-bar';
import { EmptyListComponent } from './empty-list/empty-list';
@NgModule({
	declarations: [ProgressBarComponent,
    EmptyListComponent],
	imports: [],
	exports: [ProgressBarComponent,
    EmptyListComponent]
})
export class ComponentsModule {}
