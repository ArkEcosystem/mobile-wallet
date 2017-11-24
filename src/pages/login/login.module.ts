import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';

import { TranslateModule } from '@ngx-translate/core';
import { PinCodeComponentModule } from '@components/pin-code/pin-code.module';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    TranslateModule,
    PinCodeComponentModule,
  ],
})
export class LoginPageModule {}
