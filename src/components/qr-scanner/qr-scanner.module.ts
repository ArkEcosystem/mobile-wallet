import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { QRScannerComponent } from './qr-scanner';

@NgModule({
  declarations: [QRScannerComponent],
  imports: [IonicModule],
  exports: [QRScannerComponent]
})
export class QRScannerComponentModule { }
