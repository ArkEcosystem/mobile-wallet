import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CustomNetworkCreateModal } from './custom-network-create';
import { DirectivesModule } from '@/directives/directives.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CustomNetworkCreateModal],
  imports: [
    IonicModule,
    CommonModule,
    DirectivesModule,
    TranslateModule
  ],
  exports: [
    CustomNetworkCreateModal
  ]
})
export class CustomNetworkCreateModalModule {
}
