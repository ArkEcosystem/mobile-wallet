import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ContactCreatePage } from './contact-create';

import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '@/directives/directives.module';

import { QRScannerComponentModule } from '@/components/qr-scanner/qr-scanner.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ContactCreatePage,
  ],
  imports: [
    IonicModule,
    RouterModule.forChild([{ path: '/contacts/create', component: ContactCreatePage }]),
    TranslateModule,
    DirectivesModule,
    QRScannerComponentModule,
  ],
})
export class ContactCreatePageModule {}
