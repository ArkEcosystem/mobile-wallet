import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { WalletImportPage } from './wallet-import';

import { TranslateModule } from '@ngx-translate/core';

import { QRScannerComponentModule } from '@/components/qr-scanner/qr-scanner.module';
import { PipesModule } from '@/pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    WalletImportPage,
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([{ path: '', component: WalletImportPage }]),
    TranslateModule,
    QRScannerComponentModule,
    PipesModule
  ],
})
export class WalletImportPageModule {}
