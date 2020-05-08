import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { WalletListHeaderComponent } from "./wallet-list-header.component";

@NgModule({
	declarations: [WalletListHeaderComponent],
	imports: [IonicModule, TranslateModule, CommonModule],
	exports: [WalletListHeaderComponent],
})
export class WalletsActionsComponentModule {}
