import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ConfirmTransactionComponent } from './confirm-transaction';

import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ConfirmTransactionModalModule } from '@/app/modals/confirm-transaction/confirm-transaction.module';
import { ConfirmTransactionModal } from '@/app/modals/confirm-transaction/confirm-transaction';

@NgModule({
  declarations: [ConfirmTransactionComponent],
  imports: [
    IonicModule,
    TranslateModule,
    CommonModule,
    ConfirmTransactionModalModule
  ],
  entryComponents: [
    ConfirmTransactionModal
  ],
  exports: [ConfirmTransactionComponent]
})
export class ConfirmTransactionComponentModule { }
