import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NetworkStatusPage } from './network-status';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    NetworkStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(NetworkStatusPage),
    TranslateModule,
  ],
})
export class NetworkStatusPageModule {}
