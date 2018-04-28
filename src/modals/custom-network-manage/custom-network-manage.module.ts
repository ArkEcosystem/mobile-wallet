import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomNetworkManageModal } from './custom-network-manage';
import { CustomNetworkComponentModule } from '@components/custom-network/custom-network.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CustomNetworkManageModal],
  imports: [
    IonicPageModule.forChild(CustomNetworkManageModal),
    TranslateModule,
    CustomNetworkComponentModule
  ]
})
export class CustomNetworkManageModalModule {
}
