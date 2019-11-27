import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SettingsPage } from './settings';

import { TranslateModule } from '@ngx-translate/core';
import { PinCodeComponentModule } from '@/components/pin-code/pin-code.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomNetworkCreateModalModule } from '@/app/modals/custom-network-create/custom-network-create.module';
import { CustomNetworkCreateModal } from '@/app/modals/custom-network-create/custom-network-create';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SettingsPage,
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: SettingsPage }]),
    TranslateModule,
    PinCodeComponentModule,
    CustomNetworkCreateModalModule
  ],
  entryComponents: [
    CustomNetworkCreateModal
  ]
})
export class SettingsPageModule {}
