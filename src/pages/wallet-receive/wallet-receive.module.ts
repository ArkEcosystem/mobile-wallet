import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletReceivePage } from './wallet-receive';

import { TranslateModule } from '@ngx-translate/core';
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
  declarations: [
    WalletReceivePage,
  ],
  imports: [
    IonicPageModule.forChild(WalletReceivePage),
    TranslateModule,
    QRCodeModule,
  ],
})
export class WalletReceivePageModule {}
