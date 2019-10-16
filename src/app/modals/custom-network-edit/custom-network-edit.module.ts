import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CustomNetworkEditModal } from './custom-network-edit';
import { DirectivesModule } from '@/directives/directives.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CustomNetworkEditModal],
  imports: [
    IonicModule,
    CommonModule,
    DirectivesModule,
    TranslateModule
  ],
  exports: [
    CustomNetworkEditModal
  ]
})
export class CustomNetworkEditModalModule {
}
