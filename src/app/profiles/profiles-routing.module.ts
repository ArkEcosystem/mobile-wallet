import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { ProfilesComponent } from "./profiles.component";

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: "",
				component: ProfilesComponent,
			},
		]),
	],
	exports: [RouterModule],
})
export class ProfilesRoutingModule {}
