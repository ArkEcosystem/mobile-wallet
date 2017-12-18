import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QRScannerModal } from './qr-scanner';

import { TranslateModule } from '@ngx-translate/core';
import { ClosePopupComponentModule } from '@components/close-popup/close-popup.module';

@NgModule({
  declarations: [
    QRScannerModal,
  ],
  imports: [
    IonicPageModule.forChild(QRScannerModal),
    TranslateModule,
    ClosePopupComponentModule,
  ],
})
export class QRScannerModalModule {}
