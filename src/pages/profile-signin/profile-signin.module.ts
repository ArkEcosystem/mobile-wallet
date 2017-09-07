import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileSigninPage } from './profile-signin';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ProfileSigninPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileSigninPage),
    TranslateModule,
  ]
})
export class ProfileSigninPageModule {}
