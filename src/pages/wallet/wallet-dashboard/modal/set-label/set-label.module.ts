import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetLabelPage } from './set-label';

import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [
    SetLabelPage,
  ],
  imports: [
    IonicPageModule.forChild(SetLabelPage),
    DirectivesModule,
    TranslateModule,
  ],
})
export class SetLabelPageModule {}
