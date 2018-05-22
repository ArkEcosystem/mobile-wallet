import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPage } from './settings';

import { TranslateModule } from '@ngx-translate/core';
import { PinCodeComponentModule } from '@components/pin-code/pin-code.module';

@NgModule({
  declarations: [
    SettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsPage),
    TranslateModule,
    PinCodeComponentModule
  ],
})
export class SettingsPageModule {}
