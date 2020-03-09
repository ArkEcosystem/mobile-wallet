import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { PipesModule } from "@/pipes/pipes.module";

import { AddressListComponent } from "./address-list";

@NgModule({
	declarations: [AddressListComponent],
	imports: [IonicModule, PipesModule, CommonModule],
	exports: [AddressListComponent],
})
export class AddressListComponentModule {}
