import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PinCodeModal } from './pin-code';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PinCodeModal,
  ],
  imports: [
    IonicPageModule.forChild(PinCodeModal),
    TranslateModule,
  ],
})
export class PinCodeModalModule {}
