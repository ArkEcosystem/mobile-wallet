import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { WalletManualImportPage } from './wallet-import-manual';

import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '@/directives/directives.module';
import { PipesModule } from '@/pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PinCodeModalModule } from '@/app/modals/pin-code/pin-code.module';
import { PinCodeModal } from '@/app/modals/pin-code/pin-code';

@NgModule({
  declarations: [
    WalletManualImportPage,
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: WalletManualImportPage }]),
    TranslateModule,
    DirectivesModule,
    PipesModule,
    PinCodeModalModule
  ],
  entryComponents: [
    PinCodeModal
  ]
})
export class WalletManualImportPageModule {}
