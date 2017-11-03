import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionShowPage } from './transaction-show';

import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    TransactionShowPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionShowPage),
    TranslateModule,
    PipesModule,
  ],
})
export class TransactionShowPageModule {}
