import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletManualImportPage } from './wallet-import-manual';

import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [
    WalletManualImportPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletManualImportPage),
    TranslateModule,
    DirectivesModule,
  ],
})
export class WalletManualImportPageModule {}
