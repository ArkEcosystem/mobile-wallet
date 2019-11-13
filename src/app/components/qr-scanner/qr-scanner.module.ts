import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { QRScannerComponent } from './qr-scanner';
import { CommonModule } from '@angular/common';
import { QRScannerModalModule } from '@/app/modals/qr-scanner/qr-scanner.module';
import { QRScannerModal } from '@/app/modals/qr-scanner/qr-scanner';

@NgModule({
  declarations: [QRScannerComponent],
  imports: [
    IonicModule,
    CommonModule,
    QRScannerModalModule
  ],
  entryComponents: [
    QRScannerModal
  ],
  exports: [QRScannerComponent]
})
export class QRScannerComponentModule { }
