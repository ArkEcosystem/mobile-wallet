import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared.module";

import { DelegateListComponentModule } from "../delegate-list/delegate-list.module";
import { DelegateSearchComponent } from "./delegate-search.component";

@NgModule({
	declarations: [DelegateSearchComponent],
	imports: [IonicModule, SharedModule, DelegateListComponentModule],
	exports: [DelegateSearchComponent],
})
export class DelegateSearchModule {}
