import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NetworkStatusPage } from './network-status';

import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    NetworkStatusPage,
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([{ path: '', component: NetworkStatusPage }]),
    TranslateModule,
  ],
})
export class NetworkStatusPageModule {}
