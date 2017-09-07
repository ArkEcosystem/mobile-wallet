import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletImportPage } from './wallet-import';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletImportPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletImportPage),
    TranslateModule,
  ],
})
export class WalletImportPageModule {}
