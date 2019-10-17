import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { WalletBackupModal } from './wallet-backup';

import { TranslateModule } from '@ngx-translate/core';
import { QRCodeComponentModule } from '@/components/qr-code/qr-code.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    WalletBackupModal
  ],
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    QRCodeComponentModule
  ],
  exports: [
    WalletBackupModal
  ]
})
export class WalletBackupModalModule {}
