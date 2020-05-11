import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { WalletImportComponent } from "./wallet-import.component";

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: "",
				component: WalletImportComponent,
			},
		]),
	],
	exports: [RouterModule],
})
export class WalletImportComponentRoutingModule {}
