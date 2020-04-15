import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";

import { DelegateRoutingModule } from "./delegate-routing.module";
import { DelegateService } from "./delegate.service";
import { DelegateState } from "./delegate.state";

@NgModule({
	imports: [NgxsModule.forFeature([DelegateState]), DelegateRoutingModule],
	providers: [DelegateService],
})
export class DelegateModule {}
