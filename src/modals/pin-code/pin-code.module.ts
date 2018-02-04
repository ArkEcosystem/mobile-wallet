import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PinCodeModal } from './pin-code';

import { TranslateModule } from '@ngx-translate/core';
import { ClosePopupComponentModule } from '@components/close-popup/close-popup.module';
import { DirectivesModule } from '@directives/directives.module';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    PinCodeModal,
  ],
  imports: [
  IonicPageModule.forChild(PinCodeModal),
    TranslateModule,
    ClosePopupComponentModule,
    DirectivesModule,
    PipesModule,
  ],
})
export class PinCodeModalModule {}
