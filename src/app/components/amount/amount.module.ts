import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AmountComponent } from '@/components/amount/amount';
import { DirectivesModule } from '@/directives/directives.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AmountComponent],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DirectivesModule,
    CommonModule
  ],
  exports: [AmountComponent]
})
export class AmountComponentModule { }
