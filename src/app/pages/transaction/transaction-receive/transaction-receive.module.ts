import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TransactionReceivePage } from './transaction-receive';

import { TranslateModule } from '@ngx-translate/core';
import { QRCodeComponentModule } from '@/components/qr-code/qr-code.module';
import { AmountComponentModule } from '@/components/amount/amount.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TransactionReceivePage,
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([{ path: '', component: TransactionReceivePage }]),
    TranslateModule,
    AmountComponentModule,
    QRCodeComponentModule,
  ],
})
export class WalletReceivePageModule {}
