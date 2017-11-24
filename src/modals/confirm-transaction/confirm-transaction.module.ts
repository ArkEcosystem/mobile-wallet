import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmTransactionModal } from './confirm-transaction';

import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    ConfirmTransactionModal,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmTransactionModal),
    TranslateModule,
    PipesModule,
  ],
})
export class ConfirmTransactionModalModule {}
