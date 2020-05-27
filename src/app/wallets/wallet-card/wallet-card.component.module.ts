import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { PipesModule } from "@/pipes/pipes.module";

import { WalletCardComponent } from "./wallet-card.component";

@NgModule({
	declarations: [WalletCardComponent],
	imports: [IonicModule, CommonModule, PipesModule],
	exports: [WalletCardComponent],
})
export class WalletCardComponentModule {}
