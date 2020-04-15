import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { DelegatesPageModule } from "../pages/delegates/delegates.module";

@NgModule({
	imports: [
		DelegatesPageModule,
		RouterModule.forChild([
			{
				path: "delegatesx",
				loadChildren: () =>
					import("./delegates/delegates.page.module").then(
						(m) => m.DelegatesPageModule,
					),
			},
		]),
	],
})
export class DelegateRoutingModule {}
