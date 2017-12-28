import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletDashboardPage } from './wallet-dashboard';

import { TranslateModule } from '@ngx-translate/core';

import { PipesModule } from '@pipes/pipes.module';
import { PinCodeComponentModule } from '@components/pin-code/pin-code.module';
import { ConfirmTransactionComponentModule } from '@components/confirm-transaction/confirm-transaction.module';

import { DirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [
    WalletDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletDashboardPage),
    TranslateModule,
    PipesModule,
    PinCodeComponentModule,
    ConfirmTransactionComponentModule,
    DirectivesModule,
  ],
})
export class WalletDashboardPageModule {}
