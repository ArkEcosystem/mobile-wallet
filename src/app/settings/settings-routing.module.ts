import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { SettingsComponent } from "./settings.component";

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: "settings", component: SettingsComponent },
		]),
	],
	exports: [RouterModule],
})
export class SettingsRoutingModule {}
