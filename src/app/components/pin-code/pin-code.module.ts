import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PinCodeComponent } from './pin-code';

import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [PinCodeComponent],
  imports: [
    IonicModule,
    TranslateModule,
    CommonModule
  ],
  exports: [PinCodeComponent]
})
export class PinCodeComponentModule { }
