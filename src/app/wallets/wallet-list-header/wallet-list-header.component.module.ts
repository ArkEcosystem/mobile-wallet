import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { WalletListActionsComponentModule } from "../wallet-list-actions/wallet-list-actions.component.module";
import { WalletListHeaderComponent } from "./wallet-list-header.component";

@NgModule({
	declarations: [WalletListHeaderComponent],
	imports: [
		IonicModule,
		TranslateModule,
		CommonModule,
		WalletListActionsComponentModule,
	],
	exports: [WalletListHeaderComponent],
})
export class WalletListHeaderComponentModule {}
