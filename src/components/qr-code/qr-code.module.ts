import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { QRCodeModule } from 'angular2-qrcode';
import { QRCodeComponent } from './qr-code';

@NgModule({
  declarations: [QRCodeComponent],
  imports: [IonicModule, QRCodeModule],
  exports: [QRCodeComponent]
})
export class QRCodeComponentModule { }
