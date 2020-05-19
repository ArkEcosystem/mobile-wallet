import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { WalletDetailsComponent } from "./wallet-details.component";

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: "",
				component: WalletDetailsComponent,
			},
		]),
	],
	exports: [RouterModule],
})
export class WalletDetailsRoutingModule {}
