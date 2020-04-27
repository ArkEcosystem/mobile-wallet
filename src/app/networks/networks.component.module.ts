import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { NetworksListComponentModule } from "./networks-list/networks-list.component.module";
import { NetworksComponent } from "./networks.component";

@NgModule({
	declarations: [NetworksComponent],
	imports: [
		IonicModule,
		TranslateModule,
		CommonModule,
		NetworksListComponentModule,
	],
	exports: [NetworksComponent],
})
export class NetworkListComponentModule {}
