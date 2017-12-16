import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactListPage } from './contact-list';

import { TranslateModule } from '@ngx-translate/core';
import { EmptyListComponentModule } from '@components/empty-list/empty-list.module';
import { AddressListComponentModule } from '@components/address-list/address-list.module';

@NgModule({
  declarations: [
    ContactListPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactListPage),
    TranslateModule,
    EmptyListComponentModule,
    AddressListComponentModule,
  ],
})
export class ContactListPageModule {}
