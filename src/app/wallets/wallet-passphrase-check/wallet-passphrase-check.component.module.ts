import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { PipesModule } from "@/pipes/pipes.module";

import { WalletPassphraseCheckComponent } from "./wallet-passphrase-check.component";

@NgModule({
	declarations: [WalletPassphraseCheckComponent],
	imports: [IonicModule, CommonModule, TranslateModule, PipesModule],
})
export class WalletPassphraseCheckComponentModule {}
