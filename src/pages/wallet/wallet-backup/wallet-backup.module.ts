import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletBackupPage } from './wallet-backup';

import { TranslateModule } from '@ngx-translate/core';
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
  declarations: [
    WalletBackupPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletBackupPage),
    TranslateModule,
    QRCodeModule,
  ],
})
export class WalletBackupPageModule {}
