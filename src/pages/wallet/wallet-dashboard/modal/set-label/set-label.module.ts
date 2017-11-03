import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetLabelPage } from './set-label';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SetLabelPage,
  ],
  imports: [
    IonicPageModule.forChild(SetLabelPage),
    TranslateModule,
  ],
})
export class SetLabelPageModule {}
