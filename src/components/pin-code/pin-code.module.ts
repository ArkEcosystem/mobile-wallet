import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { PinCodeComponent } from './pin-code';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PinCodeComponent],
  imports: [IonicModule, TranslateModule],
  exports: [PinCodeComponent]
})
export class PinCodeComponentModule { }
