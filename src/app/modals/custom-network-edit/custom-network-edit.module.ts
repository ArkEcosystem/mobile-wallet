import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CustomNetworkEditModal } from './custom-network-edit';
import { DirectivesModule } from '@/directives/directives.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CustomNetworkEditModal],
  imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
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
