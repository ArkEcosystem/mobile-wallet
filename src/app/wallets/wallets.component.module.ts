import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { DirectivesModule } from "@/directives/directives.module";
import { PipesModule } from "@/pipes/pipes.module";

import { WalletListEmptyComponentModule } from "./wallet-list-empty/wallet-list-empty.component.module";
import { WalletListComponentModule } from "./wallet-list/wallet-list.component.module";
import { WalletsComponentRoutingModule } from "./wallets-routing.module";
import { WalletsComponent } from "./wallets.component";

@NgModule({
	declarations: [WalletsComponent],
	imports: [
		IonicModule,
		CommonModule,
		TranslateModule,
		PipesModule,
		DirectivesModule,
		WalletListEmptyComponentModule,
		WalletListComponentModule,
		WalletsComponentRoutingModule,
	],
})
export class WalletsComponentModule {}
