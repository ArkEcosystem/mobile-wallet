import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactCreatePage } from './contact-create';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ContactCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(ContactCreatePage),
    TranslateModule,
  ],
})
export class ContactCreatePageModule {}
