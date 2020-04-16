import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared.module";

import { DelegatesListComponentModule } from "./delegate-list/delegates-list.module";
import { DelegateSearchController } from "./delegate-search/delegate-search.controller";
import { DelegateSearchModule } from "./delegate-search/delegate-search.module";
import { DelegateUnvoteBannerComponent } from "./delegate-unvote-banner/delegate-unvote-banner.component";
import { DelegatesPage } from "./delegates.page";

@NgModule({
	declarations: [DelegatesPage, DelegateUnvoteBannerComponent],
	imports: [
		IonicModule,
		SharedModule,
		DelegatesListComponentModule,
		RouterModule.forChild([{ path: "", component: DelegatesPage }]),
		DelegateSearchModule,
	],
	providers: [DelegateSearchController],
})
export class DelegatesPageModule {}
