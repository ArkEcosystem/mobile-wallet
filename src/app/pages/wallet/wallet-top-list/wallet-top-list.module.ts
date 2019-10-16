import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { WalletTopListPage } from './wallet-top-list';
import {TranslateModule} from '@ngx-translate/core';
import {PipesModule} from '@/pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    WalletTopListPage,
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([{ path: '/wallets/top', component: WalletTopListPage }]),
    TranslateModule,
    PipesModule
  ],
})
export class WalletTopListPageModule {}
