import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletDashboardPage } from './wallet-dashboard';

import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletDashboardPage),
    TranslateModule,
  ],
})
export class WalletDashboardPageModule {}
