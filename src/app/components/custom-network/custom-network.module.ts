import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CustomNetworkComponent } from './custom-network';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { CustomNetworkCreateModalModule } from '@/app/modals/custom-network-create/custom-network-create.module';
import { CustomNetworkEditModalModule } from '@/app/modals/custom-network-edit/custom-network-edit.module';
import { CustomNetworkEditModal } from '@/app/modals/custom-network-edit/custom-network-edit';
import { CustomNetworkCreateModal } from '@/app/modals/custom-network-create/custom-network-create';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CustomNetworkComponent],
  imports: [
    IonicModule,
    FormsModule,
    TranslateModule,
    CommonModule,
    CustomNetworkCreateModalModule,
    CustomNetworkEditModalModule
  ],
  entryComponents: [
    CustomNetworkEditModal,
    CustomNetworkCreateModal
  ],
  exports: [CustomNetworkComponent]
})
export class CustomNetworkComponentModule {
}
