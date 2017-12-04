import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmTransactionModal } from './confirm-transaction';

import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@pipes/pipes.module';
import { ClosePopupComponentModule } from '@components/close-popup/close-popup.module';

import { DirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [
    ConfirmTransactionModal,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmTransactionModal),
    TranslateModule,
    PipesModule,
    ClosePopupComponentModule,
    DirectivesModule,
  ],
})
export class ConfirmTransactionModalModule {}
