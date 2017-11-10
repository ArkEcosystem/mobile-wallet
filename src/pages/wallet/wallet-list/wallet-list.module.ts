import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletListPage } from './wallet-list';

import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@pipes/pipes.module';
import { EmptyListComponentModule } from '@components/empty-list/empty-list.module';

@NgModule({
  declarations: [
    WalletListPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletListPage),
    TranslateModule,
    PipesModule,
    EmptyListComponentModule,
  ],
})
export class WalletListPageModule {}
