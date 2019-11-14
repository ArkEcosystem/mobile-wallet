import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SetLabelPage } from './set-label';

import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '@/directives/directives.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SetLabelPage,
  ],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    DirectivesModule,
    TranslateModule,
  ],
  exports: [
    SetLabelPage
  ]
})
export class SetLabelPageModule {}
