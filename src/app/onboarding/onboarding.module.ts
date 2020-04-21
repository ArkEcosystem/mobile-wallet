import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";

import { SharedModule } from "../shared/shared.module";
import { OnboardingRoutingModule } from "./onboarding-routing.module";
import { OnboardingComponent } from "./onboarding.component";
import { OnboardingService } from "./shared/onboarding.service";
import { OnboardingState } from "./shared/onboarding.state";

@NgModule({
	declarations: [OnboardingComponent],
	providers: [OnboardingService],
	imports: [
		SharedModule,
		NgxsModule.forFeature([OnboardingState]),
		OnboardingRoutingModule,
	],
})
export class OnboardingModule {}
