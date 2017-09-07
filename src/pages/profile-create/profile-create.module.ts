import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileCreatePage } from './profile-create';

@NgModule({
  declarations: [
    ProfileCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileCreatePage),
  ],
})
export class ProfileCreatePageModule {}
