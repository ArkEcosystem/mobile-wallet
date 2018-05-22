import { NgModule } from '@angular/core';
import {  IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { CustomNetworkEditModal } from './custom-network-edit';

@NgModule({
  declarations: [CustomNetworkEditModal],
  imports: [
    IonicPageModule.forChild(CustomNetworkEditModal),
    TranslateModule
  ]
})
export class CustomNetworkEditModalModule {
}
