import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ConfirmTransactionComponent } from './confirm-transaction';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ConfirmTransactionComponent],
  imports: [IonicModule, TranslateModule],
  exports: [ConfirmTransactionComponent]
})
export class ConfirmTransactionComponentModule { }
