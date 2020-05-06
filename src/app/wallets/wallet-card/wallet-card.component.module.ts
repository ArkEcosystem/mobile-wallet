import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { WalletCardComponent } from "./wallet-card.component";

@NgModule({
	declarations: [WalletCardComponent],
	imports: [IonicModule, CommonModule],
	exports: [WalletCardComponent],
})
export class WalletCardComponentModule {}
