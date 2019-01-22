import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { InputFeeComponent } from './input-fee';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [InputFeeComponent],
  imports: [IonicModule, TranslateModule],
  exports: [InputFeeComponent]
})
export class InputFeeComponentModule {
}
