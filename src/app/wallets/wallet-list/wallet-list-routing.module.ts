import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { WalletListComponent } from "./wallet-list.component";

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: "",
				component: WalletListComponent,
			},
		]),
	],
	exports: [RouterModule],
})
export class WalletListComponentRoutingModule {}
