import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionReceivePage } from './transaction-receive';

import { TranslateModule } from '@ngx-translate/core';
import { QRCodeComponentModule } from '@components/qr-code/qr-code.module';

@NgModule({
  declarations: [
    TransactionReceivePage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionReceivePage),
    TranslateModule,
    QRCodeComponentModule,
  ],
})
export class WalletReceivePageModule {}
