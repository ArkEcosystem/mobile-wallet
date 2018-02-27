import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletImportPage } from './wallet-import';

import { TranslateModule } from '@ngx-translate/core';

import { QRScannerComponentModule } from '@components/qr-scanner/qr-scanner.module';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    WalletImportPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletImportPage),
    TranslateModule,
    QRScannerComponentModule,
    PipesModule
  ],
})
export class WalletImportPageModule {}
