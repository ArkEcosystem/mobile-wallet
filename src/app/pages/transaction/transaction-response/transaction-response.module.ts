import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TransactionResponsePage } from './transaction-response';

import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    TransactionResponsePage,
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([{ path: '/transaction/response', component: TransactionResponsePage }]),
    TranslateModule,
  ],
})
export class TransactionResponsePageModule {}
