import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletManualImportPage } from './wallet-import-manual';

import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '@directives/directives.module';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    WalletManualImportPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletManualImportPage),
    TranslateModule,
    DirectivesModule,
    PipesModule
  ],
})
export class WalletManualImportPageModule {}
