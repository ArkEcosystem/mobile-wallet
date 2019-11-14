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
import { SetLabelPageModule } from './modal/set-label/set-label.module';
import { SetLabelPage } from './modal/set-label/set-label';

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
    RegisterDelegatePageModule,
    SetLabelPageModule
  ],
  entryComponents: [
    RegisterDelegatePage,
    SetLabelPage
  ]
})
export class WalletDashboardPageModule {}
