import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { DelegatesComponent } from "./delegates.component";

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: "",
				component: DelegatesComponent,
			},
		]),
	],
	exports: [RouterModule],
})
export class DelegatesRoutingModule {}
