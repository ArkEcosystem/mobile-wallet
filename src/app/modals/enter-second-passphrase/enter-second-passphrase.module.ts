import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EnterSecondPassphraseModal } from './enter-second-passphrase';
import { TranslateModule } from '@ngx-translate/core';
import { ClosePopupComponentModule } from '@/components/close-popup/close-popup.module';
import { DirectivesModule } from '@/directives/directives.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EnterSecondPassphraseModal,
  ],
  imports: [
    IonicModule,
    FormsModule,
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
