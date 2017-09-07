import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileCreatePage } from './profile-create';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ProfileCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileCreatePage),
    TranslateModule,
  ],
})
export class ProfileCreatePageModule {}
