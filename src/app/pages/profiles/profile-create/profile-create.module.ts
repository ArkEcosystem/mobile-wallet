import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ProfileCreatePage } from './profile-create';

import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '@/directives/directives.module';
import {CustomNetworkComponentModule} from '@/components/custom-network/custom-network.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ProfileCreatePage,
  ],
  imports: [
    IonicModule,
    RouterModule.forChild([{ path: '/profile/create', component: ProfileCreatePage }]),
    TranslateModule,
    DirectivesModule,
    CustomNetworkComponentModule
  ],
})
export class ProfileCreatePageModule {}
