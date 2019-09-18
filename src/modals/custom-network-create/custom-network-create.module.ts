import { NgModule } from '@angular/core';
import {  IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { CustomNetworkCreateModal } from './custom-network-create';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [CustomNetworkCreateModal],
  imports: [
    IonicPageModule.forChild(CustomNetworkCreateModal),
    DirectivesModule,
    TranslateModule
  ]
})
export class CustomNetworkCreateModalModule {
}
