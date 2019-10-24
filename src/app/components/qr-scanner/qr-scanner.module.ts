import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { QRScannerComponent } from './qr-scanner';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [QRScannerComponent],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [QRScannerComponent]
})
export class QRScannerComponentModule { }
