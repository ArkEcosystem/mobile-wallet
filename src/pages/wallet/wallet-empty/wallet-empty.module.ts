import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletEmptyPage } from './wallet-empty';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletEmptyPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletEmptyPage),
    TranslateModule,
  ],
})
export class WalletEmptyPageModule {}
