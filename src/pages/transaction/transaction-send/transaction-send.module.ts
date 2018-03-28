import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionSendPage } from './transaction-send';

import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@pipes/pipes.module';
import { PinCodeComponentModule } from '@components/pin-code/pin-code.module';
import { ConfirmTransactionComponentModule } from '@components/confirm-transaction/confirm-transaction.module';
import { QRScannerComponentModule } from '@components/qr-scanner/qr-scanner.module';

import { DirectivesModule } from '@directives/directives.module';

import { AutoCompleteModule } from 'ionic2-auto-complete';
import { AmountComponentModule } from '@components/amount/amount.module';

@NgModule({
  declarations: [
    TransactionSendPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionSendPage),
    TranslateModule,
    PipesModule,
    PinCodeComponentModule,
    ConfirmTransactionComponentModule,
    QRScannerComponentModule,
    DirectivesModule,
    AutoCompleteModule,
    AmountComponentModule
  ],
})
export class TransactionSendPageModule {}
