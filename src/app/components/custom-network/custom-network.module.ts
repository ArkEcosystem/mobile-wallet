import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CustomNetworkComponent } from './custom-network';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [CustomNetworkComponent],
  imports: [
    IonicModule,
    TranslateModule,
    CommonModule
  ],
  exports: [CustomNetworkComponent]
})
export class CustomNetworkComponentModule {
}
