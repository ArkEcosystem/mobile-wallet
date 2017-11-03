import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletGenerateEntropyPage } from './wallet-generate-entropy';

import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@components/components.module';

@NgModule({
  declarations: [
    WalletGenerateEntropyPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletGenerateEntropyPage),
    TranslateModule,
    ComponentsModule,
  ],
})
export class WalletGenerateEntropyPageModule {}
