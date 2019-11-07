import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PinCodeComponent } from './pin-code';

import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { PinCodeModal } from '@/app/modals/pin-code/pin-code';
import { ClosePopupComponentModule } from '../close-popup/close-popup.module';

@NgModule({
  declarations: [
    PinCodeComponent,
    PinCodeModal
  ],
  imports: [
    IonicModule,
    TranslateModule,
    CommonModule,
    ClosePopupComponentModule
  ],
  exports: [PinCodeComponent],
  entryComponents: [
    PinCodeModal
  ]
})
export class PinCodeComponentModule { }
