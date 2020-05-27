import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { WalletListActionsComponent } from "./wallet-list-actions.component";

@NgModule({
	declarations: [WalletListActionsComponent],
	imports: [IonicModule, TranslateModule, CommonModule],
	exports: [WalletListActionsComponent],
})
export class WalletListActionsComponentModule {}
