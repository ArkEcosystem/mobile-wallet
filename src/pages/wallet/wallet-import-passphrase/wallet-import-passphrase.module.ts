import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletImportPassphrasePage } from './wallet-import-passphrase';

import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [
    WalletImportPassphrasePage,
  ],
  imports: [
    IonicPageModule.forChild(WalletImportPassphrasePage),
    TranslateModule,
    DirectivesModule,
  ],
})
export class WalletImportPassphrasePageModule {}
