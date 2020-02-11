import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { NetworkStatusPage } from "./network-status";

import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [NetworkStatusPage],
	imports: [
		IonicModule,
		CommonModule,
		RouterModule.forChild([{ path: "", component: NetworkStatusPage }]),
		TranslateModule,
	],
})
export class NetworkStatusPageModule {}
