import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { EmptyListComponent } from './empty-list';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [EmptyListComponent],
  imports: [IonicModule, TranslateModule],
  exports: [EmptyListComponent]
})
export class EmptyListComponentModule { }
