import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletRegisterSecondPassphrasePage } from './wallet-register-second-passphrase';

import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    WalletRegisterSecondPassphrasePage,
  ],
  imports: [
    IonicPageModule.forChild(WalletRegisterSecondPassphrasePage),
    TranslateModule,
    PipesModule,
  ],
})
export class WalletRegisterSecondPassphrasePageModule {}
