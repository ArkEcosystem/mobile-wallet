import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { TranslateModule } from '@ngx-translate/core';
import {PassphraseWordTesterModal} from './passphrase-word-tester';
import { PassphraseInputComponentModule } from '@components/passphrase-input/passphrase-input.module';

@NgModule({
  declarations: [
    PassphraseWordTesterModal
  ],
  imports: [
    IonicPageModule.forChild(PassphraseWordTesterModal),
    TranslateModule,
    PassphraseInputComponentModule
  ],
})
export class PassphraseWordTesterModalModule {}
