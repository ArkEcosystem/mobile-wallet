import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { QRScannerModal } from './qr-scanner';

import { TranslateModule } from '@ngx-translate/core';
import { ClosePopupComponentModule } from '@/components/close-popup/close-popup.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    QRScannerModal,
  ],
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    ClosePopupComponentModule,
  ],
  exports: [
    QRScannerModal
  ]
})
export class QRScannerModalModule {}
