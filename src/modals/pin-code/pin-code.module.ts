import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PinCodeModal } from './pin-code';

import { TranslateModule } from '@ngx-translate/core';
import { ClosePopupComponentModule } from '@components/close-popup/close-popup.module';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [
    PinCodeModal,
  ],
  imports: [
    IonicPageModule.forChild(PinCodeModal),
    TranslateModule,
    ClosePopupComponentModule,
    DirectivesModule,
  ],
})
export class PinCodeModalModule {}
