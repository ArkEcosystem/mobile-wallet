import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { InputFeeComponent } from './input-fee';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [InputFeeComponent],
  imports: [
    IonicModule,
    TranslateModule,
    CommonModule
  ],
  exports: [InputFeeComponent]
})
export class InputFeeComponentModule {
}
