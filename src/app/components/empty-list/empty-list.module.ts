import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EmptyListComponent } from './empty-list';

import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [EmptyListComponent],
  imports: [
    IonicModule, 
    TranslateModule,
    CommonModule
  ],
  exports: [EmptyListComponent]
})
export class EmptyListComponentModule { }
