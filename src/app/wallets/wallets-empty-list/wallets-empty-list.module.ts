import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { WalletsEmptyListComponent } from "./wallets-empty-list.component";

@NgModule({
	declarations: [WalletsEmptyListComponent],
	imports: [IonicModule, TranslateModule, CommonModule],
	exports: [WalletsEmptyListComponent],
})
export class WalletsEmptyListComponentModule {}
