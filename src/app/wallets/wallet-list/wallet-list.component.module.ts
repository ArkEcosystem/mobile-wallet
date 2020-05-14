import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { PipesModule } from "@/pipes/pipes.module";

import { WalletCardComponentModule } from "../wallet-card/wallet-card.component.module";
import { WalletListActionsComponentModule } from "../wallet-list-actions/wallet-list-actions.component.module";
import { WalletListEmptyComponentModule } from "../wallet-list-empty/wallet-list-empty.component.module";
import { WalletListHeaderComponentModule } from "../wallet-list-header/wallet-list-header.component.module";
import { WalletListComponent } from "./wallet-list.component";

@NgModule({
	declarations: [WalletListComponent],
	imports: [
		IonicModule,
		CommonModule,
		TranslateModule,
		PipesModule,
		WalletListEmptyComponentModule,
		WalletListActionsComponentModule,
		WalletListHeaderComponentModule,
		WalletCardComponentModule,
	],
	exports: [WalletListComponent],
})
export class WalletListComponentModule {}
