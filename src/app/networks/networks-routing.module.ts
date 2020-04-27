import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { NetworksComponent } from "./networks.component";

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: "",
				component: NetworksComponent,
			},
		]),
	],
	exports: [RouterModule],
})
export class NetworksRoutingModule {}
