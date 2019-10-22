import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { WalletManualImportPage } from './wallet-import-manual';

import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '@/directives/directives.module';
import { PipesModule } from '@/pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    WalletManualImportPage,
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([{ path: '', component: WalletManualImportPage }]),
    TranslateModule,
    DirectivesModule,
    PipesModule
  ],
})
export class WalletManualImportPageModule {}
