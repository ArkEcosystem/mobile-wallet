import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PinCodeComponent } from './pin-code';

import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { PinCodeModal } from '@/app/modals/pin-code/pin-code';
import { ClosePopupComponentModule } from '../close-popup/close-popup.module';
import { PinCodeModalModule } from '@/app/modals/pin-code/pin-code.module';

@NgModule({
  declarations: [
    PinCodeComponent
  ],
  imports: [
    IonicModule,
    TranslateModule,
    CommonModule,
    ClosePopupComponentModule,
    PinCodeModalModule
  ],
  exports: [PinCodeComponent],
  entryComponents: [
    PinCodeModal
  ]
})
export class PinCodeComponentModule { }
