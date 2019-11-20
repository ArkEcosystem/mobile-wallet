import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { WalletBackupModal } from './wallet-backup';

import { TranslateModule } from '@ngx-translate/core';
import { QRCodeComponentModule } from '@/components/qr-code/qr-code.module';
import { CommonModule } from '@angular/common';
import { PassphraseWordTesterModalModule } from '../passphrase-word-tester/passphrase-word-tester.module';
import { PassphraseWordTesterModal } from '../passphrase-word-tester/passphrase-word-tester';

@NgModule({
  declarations: [
    WalletBackupModal
  ],
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    QRCodeComponentModule,
    PassphraseWordTesterModalModule
  ],
  entryComponents: [
    PassphraseWordTesterModal
  ],
  exports: [
    WalletBackupModal
  ]
})
export class WalletBackupModalModule {}
