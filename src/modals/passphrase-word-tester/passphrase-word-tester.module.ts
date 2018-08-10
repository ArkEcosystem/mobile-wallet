import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { TranslateModule } from '@ngx-translate/core';
import {PassphraseWordTesterModal} from './passphrase-word-tester';
import { PassphraseInputComponent } from '@components/passphrase-input/passphrase-input';

@NgModule({
  declarations: [
    PassphraseWordTesterModal,
    PassphraseInputComponent
  ],
  imports: [
    IonicPageModule.forChild(PassphraseWordTesterModal),
    TranslateModule
  ],
})
export class PassphraseWordTesterModalModule {}
