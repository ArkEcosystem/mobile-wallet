import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { NetworkListComponentModule } from "./network-list/network-list.component.module";
import { NetworksComponent } from "./networks.component";

@NgModule({
	declarations: [NetworksComponent],
	imports: [
		IonicModule,
		TranslateModule,
		CommonModule,
		NetworkListComponentModule,
	],
	exports: [NetworksComponent],
})
export class NetworkComponentModule {}
