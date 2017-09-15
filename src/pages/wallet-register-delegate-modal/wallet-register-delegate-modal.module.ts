import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletRegisterDelegateModalPage } from './wallet-register-delegate-modal';

import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    WalletRegisterDelegateModalPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletRegisterDelegateModalPage),
    TranslateModule,
    PipesModule,
  ],
})
export class WalletRegisterDelegateModalPageModule {}
