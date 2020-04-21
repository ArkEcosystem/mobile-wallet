import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { OnboardingComponent } from "./onboarding.component";

@NgModule({
	imports: [
		RouterModule.forChild([{ path: "", component: OnboardingComponent }]),
	],
	exports: [RouterModule],
})
export class OnboardingRoutingModule {}
