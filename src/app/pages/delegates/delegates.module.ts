import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DelegatesPage } from './delegates';

import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@/pipes/pipes.module';
import { FilterPipeModule } from 'ngx-filter-pipe';

import { PinCodeComponentModule } from '@/components/pin-code/pin-code.module';
import { ConfirmTransactionComponentModule } from '@/components/confirm-transaction/confirm-transaction.module';

@NgModule({
  declarations: [
    DelegatesPage,
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([{ path: '/delegates', component: DelegatesPage }]),
    TranslateModule,
    PipesModule,
    FilterPipeModule,
    PinCodeComponentModule,
    ConfirmTransactionComponentModule,
  ],
})
export class DelegatesPageModule {}
