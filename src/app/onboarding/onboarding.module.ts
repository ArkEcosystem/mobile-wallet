import { NgModule } from "@angular/core";

import { SharedModule } from "../shared/shared.module";
import { OnboardingRoutingModule } from "./onboarding-routing.module";
import { OnboardingComponent } from "./onboarding.component";
import { OnboardingService } from "./shared/onboarding.service";

@NgModule({
	declarations: [OnboardingComponent],
	providers: [OnboardingService],
	imports: [SharedModule, OnboardingRoutingModule],
})
export class OnboardingModule {}
