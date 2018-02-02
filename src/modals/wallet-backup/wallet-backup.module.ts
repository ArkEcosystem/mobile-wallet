import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletBackupModal } from './wallet-backup';

import { TranslateModule } from '@ngx-translate/core';
import { QRCodeComponentModule } from '@components/qr-code/qr-code.module';

@NgModule({
  declarations: [
    WalletBackupModal
  ],
  imports: [
    IonicPageModule.forChild(WalletBackupModal),
    TranslateModule,
    QRCodeComponentModule
  ],
})
export class WalletBackupModalModule {}
