import { NgModule } from '@angular/core';
import { ProgressBarComponent } from './progress-bar/progress-bar';
import { EmptyListComponentModule } from './empty-list/empty-list.module';
import { SwipeContactsComponentModule } from './swipe-contacts/swipe-contacts.module';

@NgModule({
	declarations: [ProgressBarComponent],
	imports: [],
	exports: [ProgressBarComponent, EmptyListComponentModule, SwipeContactsComponentModule]
})
export class ComponentsModule {}
