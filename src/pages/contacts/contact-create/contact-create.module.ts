import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactCreatePage } from './contact-create';

import { TranslateModule } from '@ngx-translate/core';

import { QRScannerComponentModule } from '@components/qr-scanner/qr-scanner.module';

@NgModule({
  declarations: [
    ContactCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(ContactCreatePage),
    TranslateModule,
    QRScannerComponentModule,
  ],
})
export class ContactCreatePageModule {}
