import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ClosePopupComponent } from './close-popup';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ClosePopupComponent],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [ClosePopupComponent]
})
export class ClosePopupComponentModule { }
