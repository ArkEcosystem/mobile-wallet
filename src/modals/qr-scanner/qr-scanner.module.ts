import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QRScannerModal } from './qr-scanner';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    QRScannerModal,
  ],
  imports: [
    IonicPageModule.forChild(QRScannerModal),
    TranslateModule,
  ],
})
export class QRScannerModalModule {}
