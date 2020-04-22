import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { WalletEmptyListComponent } from "./wallet-empty-list.component";

@NgModule({
	declarations: [WalletEmptyListComponent],
	imports: [IonicModule, TranslateModule, CommonModule],
	exports: [WalletEmptyListComponent],
})
export class WalletEmptyListComponentModule {}
