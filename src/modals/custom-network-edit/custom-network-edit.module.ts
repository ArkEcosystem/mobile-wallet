import { NgModule } from '@angular/core';
import {  IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { CustomNetworkEditModal } from './custom-network-edit';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [CustomNetworkEditModal],
  imports: [
    IonicPageModule.forChild(CustomNetworkEditModal),
    DirectivesModule,
    TranslateModule
  ]
})
export class CustomNetworkEditModalModule {
}
