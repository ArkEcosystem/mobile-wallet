import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { TranslateModule } from '@ngx-translate/core';
import {PassphraseWordTesterModal} from './passphrase-word-tester';

@NgModule({
  declarations: [
    PassphraseWordTesterModal,
  ],
  imports: [
    IonicPageModule.forChild(PassphraseWordTesterModal),
    TranslateModule
  ],
})
export class PassphraseWordTesterModalModule {}
