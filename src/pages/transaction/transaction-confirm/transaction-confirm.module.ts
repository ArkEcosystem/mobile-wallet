import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionConfirmPage } from './transaction-confirm';

import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    TransactionConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionConfirmPage),
    TranslateModule,
    PipesModule,
  ],
})
export class TransactionConfirmPageModule {}
