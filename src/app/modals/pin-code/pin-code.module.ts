import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PinCodeModal } from './pin-code';

import { TranslateModule } from '@ngx-translate/core';
import { ClosePopupComponentModule } from '@/components/close-popup/close-popup.module';
import { DirectivesModule } from '@/directives/directives.module';
import { PipesModule } from '@/pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { ClosePopupComponent } from '@/components/close-popup/close-popup';

@NgModule({
  declarations: [
    PinCodeModal,
    ClosePopupComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    ClosePopupComponentModule,
    DirectivesModule,
    PipesModule,
  ],
  exports: [
    PinCodeModal
  ]
})
export class PinCodeModalModule {}
