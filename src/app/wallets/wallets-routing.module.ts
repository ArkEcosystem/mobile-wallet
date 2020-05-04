import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { WalletsComponent } from "./wallets.component";

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: "",
				component: WalletsComponent,
			},
		]),
	],
	exports: [RouterModule],
})
export class WalletsRoutingModule {}
