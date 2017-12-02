import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnterSecondPassphraseModal } from './enter-second-passphrase';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    EnterSecondPassphraseModal,
  ],
  imports: [
    IonicPageModule.forChild(EnterSecondPassphraseModal),
    TranslateModule,
  ],
})
export class EnterSecondPassphraseModalModule {}
