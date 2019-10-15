import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NetworkStatusPage } from './network-status';

import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    NetworkStatusPage,
  ],
  imports: [
    IonicModule,
    RouterModule.forChild([{ path: '/network-status', component: NetworkStatusPage }]),
    TranslateModule,
  ],
})
export class NetworkStatusPageModule {}
