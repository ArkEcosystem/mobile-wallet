import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionReceivePage } from './transaction-receive';

import { TranslateModule } from '@ngx-translate/core';
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
  declarations: [
    TransactionReceivePage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionReceivePage),
    TranslateModule,
    QRCodeModule,
  ],
})
export class WalletReceivePageModule {}
