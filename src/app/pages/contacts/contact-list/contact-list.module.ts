import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ContactListPage } from './contact-list';

import { TranslateModule } from '@ngx-translate/core';
import { EmptyListComponentModule } from '@/components/empty-list/empty-list.module';
import { AddressListComponentModule } from '@/components/address-list/address-list.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ContactListPage,
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([{ path: '', component: ContactListPage }]),
    TranslateModule,
    EmptyListComponentModule,
    AddressListComponentModule,
  ],
})
export class ContactListPageModule {}
