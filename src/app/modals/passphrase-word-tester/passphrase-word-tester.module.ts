import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';
import {PassphraseWordTesterModal} from './passphrase-word-tester';
import { PassphraseInputComponentModule } from '@/components/passphrase-input/passphrase-input.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PassphraseWordTesterModal
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    PassphraseInputComponentModule
  ],
  exports: [
    PassphraseWordTesterModal
  ]
})
export class PassphraseWordTesterModalModule {}
