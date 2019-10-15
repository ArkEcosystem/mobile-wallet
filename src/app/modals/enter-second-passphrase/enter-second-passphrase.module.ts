import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EnterSecondPassphraseModal } from './enter-second-passphrase';
import { TranslateModule } from '@ngx-translate/core';
import { ClosePopupComponentModule } from '@/components/close-popup/close-popup.module';
import { DirectivesModule } from '@/directives/directives.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    EnterSecondPassphraseModal,
  ],
  imports: [
    IonicModule,
    CommonModule,
    DirectivesModule,
    TranslateModule,
    ClosePopupComponentModule,
  ],
  exports: [
    EnterSecondPassphraseModal
  ]
})
export class EnterSecondPassphraseModalModule {}
