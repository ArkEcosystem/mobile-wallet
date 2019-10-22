import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AddressListComponent } from './address-list';
import { PipesModule } from '@/pipes/pipes.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [AddressListComponent],
  imports: [IonicModule, PipesModule, CommonModule],
  exports: [AddressListComponent]
})
export class AddressListComponentModule { }
