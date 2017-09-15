import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletLabelModalPage } from './wallet-label-modal';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletLabelModalPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletLabelModalPage),
    TranslateModule,
  ],
})
export class WalletLabelModalPageModule {}
