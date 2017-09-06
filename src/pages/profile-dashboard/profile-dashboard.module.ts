import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileDashboardPage } from './profile-dashboard';

@NgModule({
  declarations: [
    ProfileDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileDashboardPage),
  ],
})
export class ProfileDashboardPageModule {}
