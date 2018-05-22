import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CustomNetworkComponent } from './custom-network';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CustomNetworkComponent],
  imports: [IonicModule, TranslateModule],
  exports: [CustomNetworkComponent]
})
export class CustomNetworkComponentModule {
}
