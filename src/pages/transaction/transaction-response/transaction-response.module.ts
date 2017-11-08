import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionResponsePage } from './transaction-response';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TransactionResponsePage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionResponsePage),
    TranslateModule,
  ],
})
export class TransactionResponsePageModule {}
