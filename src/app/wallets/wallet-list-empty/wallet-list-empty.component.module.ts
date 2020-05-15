import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { WalletListActionsComponentModule } from "../wallet-list-actions/wallet-list-actions.component.module";
import { WalletListEmptyComponent } from "./wallet-list-empty.component";

@NgModule({
	declarations: [WalletListEmptyComponent],
	imports: [
		IonicModule,
		TranslateModule,
		WalletListActionsComponentModule,
		CommonModule,
	],
	exports: [WalletListEmptyComponent],
})
export class WalletListEmptyComponentModule {}
