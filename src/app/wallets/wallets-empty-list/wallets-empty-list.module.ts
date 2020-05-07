import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { WalletsActionsComponentModule } from "../wallets-actions/wallets-actions.component.module";
import { WalletsEmptyListComponent } from "./wallets-empty-list.component";

@NgModule({
	declarations: [WalletsEmptyListComponent],
	imports: [
		IonicModule,
		TranslateModule,
		WalletsActionsComponentModule,
		CommonModule,
	],
	exports: [WalletsEmptyListComponent],
})
export class WalletsEmptyListComponentModule {}
