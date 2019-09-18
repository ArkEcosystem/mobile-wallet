import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileCreatePage } from './profile-create';

import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '@directives/directives.module';
import {CustomNetworkComponentModule} from '@components/custom-network/custom-network.module';

@NgModule({
  declarations: [
    ProfileCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileCreatePage),
    TranslateModule,
    DirectivesModule,
    CustomNetworkComponentModule
  ],
})
export class ProfileCreatePageModule {}
