import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { DelegatesPage } from "./delegates.page";

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: "delegatesx",
				component: DelegatesPage,
			},
		]),
	],
	exports: [RouterModule],
})
export class DelegatesRoutingModule {}
