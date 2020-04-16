import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared.module";

import { DelegatesListComponentModule } from "../delegate-list/delegates-list.module";
import { DelegateSearchComponent } from "./delegate-search.component";

@NgModule({
	declarations: [DelegateSearchComponent],
	imports: [IonicModule, SharedModule, DelegatesListComponentModule],
	exports: [DelegateSearchComponent],
})
export class DelegateSearchModule {}
