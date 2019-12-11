import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CustomNetworkManageModal } from './custom-network-manage';
import { CustomNetworkComponentModule } from '@/components/custom-network/custom-network.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CustomNetworkManageModal],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    CustomNetworkComponentModule
  ],
  exports: [
    CustomNetworkManageModal
  ]
})
export class CustomNetworkManageModalModule {
}
