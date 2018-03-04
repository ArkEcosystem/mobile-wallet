import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactCreatePage } from './contact-create';

import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '@directives/directives.module';

import { QRScannerComponentModule } from '@components/qr-scanner/qr-scanner.module';

@NgModule({
  declarations: [
    ContactCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(ContactCreatePage),
    TranslateModule,
    DirectivesModule,
    QRScannerComponentModule,
  ],
})
export class ContactCreatePageModule {}
