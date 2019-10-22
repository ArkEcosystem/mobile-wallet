import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from './login';

import { TranslateModule } from '@ngx-translate/core';
import { PinCodeComponentModule } from '@/components/pin-code/pin-code.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([{ path: '', component: LoginPage }]),
    TranslateModule,
    PinCodeComponentModule,
  ],
})
export class LoginPageModule {}
