import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { AddressListComponentModule } from "@/components/address-list/address-list.module";
import { EmptyListComponentModule } from "@/components/empty-list/empty-list.module";

import { ContactListPage } from "./contact-list";

@NgModule({
	declarations: [ContactListPage],
	imports: [
		IonicModule,
		CommonModule,
		RouterModule.forChild([{ path: "", component: ContactListPage }]),
		TranslateModule,
		EmptyListComponentModule,
		AddressListComponentModule,
	],
})
export class ContactListPageModule {}
