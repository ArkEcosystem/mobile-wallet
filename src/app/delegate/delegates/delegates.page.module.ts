import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared.module";
import { IdenticonComponentModule } from "@/components/identicon/identicon.module";

import { DelegatesListComponent } from "./delegates-list/delegates-list.component";
import { DelegatesPage } from "./delegates.page";

@NgModule({
	declarations: [DelegatesPage, DelegatesListComponent],
	imports: [
		IonicModule,
		SharedModule,
		IdenticonComponentModule,
		RouterModule.forChild([{ path: "", component: DelegatesPage }]),
	],
})
export class DelegatesPageModule {}
