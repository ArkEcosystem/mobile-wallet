import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PinCodePage } from './pin-code';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PinCodePage,
  ],
  imports: [
    IonicPageModule.forChild(PinCodePage),
    TranslateModule,
  ],
})
export class PinCodePageModule {}
