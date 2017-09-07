import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletImportPassphrasePage } from './wallet-import-passphrase';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    WalletImportPassphrasePage,
  ],
  imports: [
    IonicPageModule.forChild(WalletImportPassphrasePage),
    TranslateModule,
  ],
})
export class WalletImportPassphrasePageModule {}
