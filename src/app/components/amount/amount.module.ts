import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AmountComponent } from '@/components/amount/amount';
import { DirectivesModule } from '@/directives/directives.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AmountComponent],
  imports: [
    IonicModule,
    DirectivesModule,
    CommonModule
  ],
  exports: [AmountComponent]
})
export class AmountComponentModule { }
