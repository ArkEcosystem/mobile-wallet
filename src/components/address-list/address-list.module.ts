import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { AddressListComponent } from './address-list';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [AddressListComponent],
  imports: [IonicModule, PipesModule],
  exports: [AddressListComponent]
})
export class AddressListComponentModule { }
