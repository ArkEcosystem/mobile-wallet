import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { NetworkCardComponentModule } from "../network-card/network-card.component.module";
import { NetworkListComponent } from "./network-list.component";

@NgModule({
	declarations: [NetworkListComponent],
	imports: [
		IonicModule,
		TranslateModule,
		CommonModule,
		NetworkCardComponentModule,
	],
	exports: [NetworkListComponent],
})
export class NetworkListComponentModule {}
