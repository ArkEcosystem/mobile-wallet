import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletCreatePage } from './wallet-create';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(WalletCreatePage),
    TranslateModule,
  ],
})
export class WalletCreatePageModule {}
