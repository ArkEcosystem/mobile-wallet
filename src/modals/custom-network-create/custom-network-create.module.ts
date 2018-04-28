import { NgModule } from '@angular/core';
import {  IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { CustomNetworkCreateModal } from './custom-network-create';

@NgModule({
  declarations: [CustomNetworkCreateModal],
  imports: [
    IonicPageModule.forChild(CustomNetworkCreateModal),
    TranslateModule
  ]
})
export class CustomNetworkCreateModalModule {
}
