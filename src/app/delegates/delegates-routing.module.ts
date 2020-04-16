import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { DelegatesPageModule } from "./delegates.module";

@NgModule({
	imports: [
		DelegatesPageModule,
		RouterModule.forChild([
			{
				path: "delegatesx",
				loadChildren: () =>
					import("./delegates.module").then(
						(m) => m.DelegatesPageModule,
					),
			},
		]),
	],
})
export class DelegatesRoutingModule {}
