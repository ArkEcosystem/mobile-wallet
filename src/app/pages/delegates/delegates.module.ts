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
import { FormsModule } from '@angular/forms';
import { DelegateDetailPageModule } from './delegate-detail/delegate-detail.module';
import { DelegateDetailPage } from './delegate-detail/delegate-detail';

@NgModule({
  declarations: [
    DelegatesPage,
  ],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild([{ path: '', component: DelegatesPage }]),
    TranslateModule,
    PipesModule,
    FilterPipeModule,
    PinCodeComponentModule,
    ConfirmTransactionComponentModule,
    DelegateDetailPageModule
  ],
  entryComponents: [
    DelegateDetailPage
  ]
})
export class DelegatesPageModule {}
