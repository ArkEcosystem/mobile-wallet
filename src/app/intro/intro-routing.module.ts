import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { IntroPage } from "./intro.component";

@NgModule({
	imports: [RouterModule.forChild([{ path: "intro", component: IntroPage }])],
	exports: [RouterModule],
})
export class IntroRoutingModule {}
