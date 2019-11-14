import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TransactionSendPage } from './transaction-send';

import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@/pipes/pipes.module';
import { PinCodeComponentModule } from '@/components/pin-code/pin-code.module';
import { ConfirmTransactionComponentModule } from '@/components/confirm-transaction/confirm-transaction.module';
import { QRScannerComponentModule } from '@/components/qr-scanner/qr-scanner.module';
import { InputFeeComponentModule } from '@/components/input-fee/input-fee.module';

import { DirectivesModule } from '@/directives/directives.module';

import { AutoCompleteModule } from 'ionic4-auto-complete';
import { AmountComponentModule } from '@/components/amount/amount.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TransactionSendPage,
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: TransactionSendPage }]),
    TranslateModule,
    PipesModule,
    PinCodeComponentModule,
    ConfirmTransactionComponentModule,
    QRScannerComponentModule,
    DirectivesModule,
    AutoCompleteModule,
    AmountComponentModule,
    InputFeeComponentModule
  ],
})
export class TransactionSendPageModule {}
