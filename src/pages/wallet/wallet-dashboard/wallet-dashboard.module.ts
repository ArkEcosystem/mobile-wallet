import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletDashboardPage } from './wallet-dashboard';

import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { TranslateModule } from '@ngx-translate/core';

import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    WalletDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletDashboardPage),
    TranslateModule,
    PipesModule,
  ],
})
export class WalletDashboardPageModule {}
