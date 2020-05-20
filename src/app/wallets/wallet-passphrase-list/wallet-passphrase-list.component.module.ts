import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { PipesModule } from "@/pipes/pipes.module";

import { WalletPassphraseListComponent } from "./wallet-passphrase-list.component";

@NgModule({
	declarations: [WalletPassphraseListComponent],
	imports: [IonicModule, CommonModule, TranslateModule, PipesModule],
})
export class WalletPassphraseListComponentModule {}
