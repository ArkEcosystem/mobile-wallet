import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProfileSigninPage } from './profile-signin';

import { TranslateModule } from '@ngx-translate/core';
import { EmptyListComponentModule } from '@/components/empty-list/empty-list.module';
import { AddressListComponentModule } from '@/components/address-list/address-list.module';
import { PinCodeComponentModule } from '@/components/pin-code/pin-code.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ProfileSigninPage,
  ],
  imports: [
    CommonModule,
    EmptyListComponentModule,
    TranslateModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: ProfileSigninPage }]),
    AddressListComponentModule,
    PinCodeComponentModule,
  ],
})
export class ProfileSigninPageModule {}
