import { NgModule } from "@angular/core";

import { WalletsRoutingModule } from "./wallets-routing.module";
import { WalletsComponent } from "./wallets.component";

@NgModule({
	declarations: [WalletsComponent],
	imports: [WalletsRoutingModule],
	exports: [],
	providers: [],
})
export class WalletsModule {}
