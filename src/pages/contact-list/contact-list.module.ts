import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactListPage } from './contact-list';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ContactListPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactListPage),
    TranslateModule,
  ],
})
export class ContactListPageModule {}
