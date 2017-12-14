import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileCreatePage } from './profile-create';

import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [
    ProfileCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileCreatePage),
    TranslateModule,
    DirectivesModule,
  ],
})
export class ProfileCreatePageModule {}
