import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CustomNetworkCreateModal } from './custom-network-create';
import { DirectivesModule } from '@/directives/directives.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CustomNetworkCreateModal],
  imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
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
