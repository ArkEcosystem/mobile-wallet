import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { WalletTopListPage } from './wallet-top-list';
import {TranslateModule} from '@ngx-translate/core';
import {PipesModule} from '@/pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TopWalletDetailsPage } from './modal/top-wallet-details/top-wallet-details';
import { TopWalletDetailsPageModule } from './modal/top-wallet-details/top-wallet-details.module';

@NgModule({
  declarations: [
    WalletTopListPage,
  ],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild([{ path: '', component: WalletTopListPage }]),
    TranslateModule,
    PipesModule,
    TopWalletDetailsPageModule
  ],
  entryComponents: [
    TopWalletDetailsPage
  ]
})
export class WalletTopListPageModule {}
