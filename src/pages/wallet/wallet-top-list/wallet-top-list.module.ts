import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletTopListPage } from './wallet-top-list';
import {TranslateModule} from '@root/node_modules/@ngx-translate/core';
import {PipesModule} from '@pipes/pipes.module';

@NgModule({
  declarations: [
    WalletTopListPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletTopListPage),
    TranslateModule,
    PipesModule
  ],
})
export class WalletTopListPageModule {}
