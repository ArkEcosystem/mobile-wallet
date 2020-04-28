import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { SettingsPage } from "./settings.component";

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: "",
				component: SettingsPage,
			},
		]),
	],
	exports: [RouterModule],
})
export class SettingsRoutingModule {}
