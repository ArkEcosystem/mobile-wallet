import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileSigninPage } from './profile-signin';

import { TranslateModule } from '@ngx-translate/core';
import { EmptyListComponentModule } from '@components/empty-list/empty-list.module';

@NgModule({
  declarations: [
    ProfileSigninPage,
  ],
  imports: [
    EmptyListComponentModule,
    TranslateModule,
    IonicPageModule.forChild(ProfileSigninPage),
  ]
})
export class ProfileSigninPageModule {}
