import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ConfirmTransactionComponent } from './confirm-transaction';

import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ConfirmTransactionComponent],
  imports: [
    IonicModule,
    TranslateModule,
    CommonModule
  ],
  exports: [ConfirmTransactionComponent]
})
export class ConfirmTransactionComponentModule { }
