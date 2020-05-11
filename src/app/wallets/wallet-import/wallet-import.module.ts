import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { ImportInputComponentModule } from "./import-input/import-input.module";
import { WalletImportComponent } from "./wallet-import.component";

@NgModule({
	declarations: [WalletImportComponent],
	imports: [
		IonicModule,
		TranslateModule,
		CommonModule,
		ImportInputComponentModule,
	],
})
export class WalletImportComponentModule {}
