import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { BottomDrawerComponentModule } from "@/components/bottom-drawer/bottom-drawer.module";
import { IdenticonComponentModule } from "@/components/identicon/identicon.module";
import { PipesModule } from "@/pipes/pipes.module";

import { WalletDetailsComponent } from "./wallet-details.component";

@NgModule({
	declarations: [WalletDetailsComponent],
	imports: [
		IonicModule,
		CommonModule,
		PipesModule,
		BottomDrawerComponentModule,
		IdenticonComponentModule,
	],
	exports: [WalletDetailsComponent],
})
export class WalletDetailsComponentModule {}
