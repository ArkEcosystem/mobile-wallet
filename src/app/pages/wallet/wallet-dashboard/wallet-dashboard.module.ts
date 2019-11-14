import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { WalletDashboardPage } from './wallet-dashboard';

import { TranslateModule } from '@ngx-translate/core';

import { PipesModule } from '@/pipes/pipes.module';
import { PinCodeComponentModule } from '@/components/pin-code/pin-code.module';
import { ConfirmTransactionComponentModule } from '@/components/confirm-transaction/confirm-transaction.module';

import { DirectivesModule } from '@/directives/directives.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegisterDelegatePageModule } from './modal/register-delegate/register-delegate.module';
import { RegisterDelegatePage } from './modal/register-delegate/register-delegate';

@NgModule({
  declarations: [
    WalletDashboardPage,
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([{ path: '', component: WalletDashboardPage }]),
    TranslateModule,
    PipesModule,
    PinCodeComponentModule,
    ConfirmTransactionComponentModule,
    DirectivesModule,
    RegisterDelegatePageModule
  ],
  entryComponents: [
    RegisterDelegatePage
  ]
})
export class WalletDashboardPageModule {}
