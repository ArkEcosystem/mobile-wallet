import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SettingsPage } from './settings';

import { TranslateModule } from '@ngx-translate/core';
import { PinCodeComponentModule } from '@/components/pin-code/pin-code.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    SettingsPage,
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([{ path: '', component: SettingsPage }]),
    TranslateModule,
    PinCodeComponentModule
  ],
})
export class SettingsPageModule {}
