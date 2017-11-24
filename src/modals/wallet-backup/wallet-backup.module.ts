import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletBackupModal } from './wallet-backup';

import { TranslateModule } from '@ngx-translate/core';
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
  declarations: [
    WalletBackupModal,
  ],
  imports: [
    IonicPageModule.forChild(WalletBackupModal),
    TranslateModule,
    QRCodeModule,
  ],
})
export class WalletBackupModalModule {}
