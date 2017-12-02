import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnterSecondPassphraseModal } from './enter-second-passphrase';
import { TranslateModule } from '@ngx-translate/core';
import { ClosePopupComponentModule } from '@components/close-popup/close-popup.module';

@NgModule({
  declarations: [
    EnterSecondPassphraseModal,
  ],
  imports: [
    IonicPageModule.forChild(EnterSecondPassphraseModal),
    TranslateModule,
    ClosePopupComponentModule,
  ],
})
export class EnterSecondPassphraseModalModule {}
