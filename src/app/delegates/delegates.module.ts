import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { NgxsModule } from "@ngxs/store";

import { SharedModule } from "@/app/shared.module";

import { DelegateListComponentModule } from "./delegate-list/delegate-list.module";
import { DelegateSearchModule } from "./delegate-search/delegate-search.module";
import { DelegateUnvoteBannerComponent } from "./delegate-unvote-banner/delegate-unvote-banner.component";
import { DelegatesRoutingModule } from "./delegates-routing.module";
import { DelegatesComponent } from "./delegates.component";
import { DelegateService } from "./shared/delegate.service";
import { DelegateServiceMock } from "./shared/delegate.service.mock";
import { DelegateState } from "./shared/delegate.state";

@NgModule({
	declarations: [DelegatesComponent, DelegateUnvoteBannerComponent],
	imports: [
		IonicModule,
		SharedModule,
		NgxsModule.forFeature([DelegateState]),
		DelegateListComponentModule,
		DelegateSearchModule,
		DelegatesRoutingModule,
	],
	providers: [{ provide: DelegateService, useClass: DelegateServiceMock }],
})
export class DelegatesModule {}
