import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PinCodeComponent } from './pin-code';

import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { PinCodeModal } from '@/app/modals/pin-code/pin-code';
import { ClosePopupComponent } from '../close-popup/close-popup';

@NgModule({
  declarations: [
    PinCodeComponent,
    PinCodeModal,
    ClosePopupComponent
  ],
  imports: [
    IonicModule,
    TranslateModule,
    CommonModule
  ],
  exports: [PinCodeComponent],
  entryComponents: [
    PinCodeModal
  ]
})
export class PinCodeComponentModule { }
