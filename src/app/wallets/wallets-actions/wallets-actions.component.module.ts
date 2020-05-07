import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { WalletsActionsComponent } from "./wallets-actions.component";

@NgModule({
	declarations: [WalletsActionsComponent],
	imports: [IonicModule, TranslateModule, CommonModule],
	exports: [WalletsActionsComponent],
})
export class WalletsActionsComponentModule {}
