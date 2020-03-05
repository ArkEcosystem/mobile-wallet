import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { NetworkStatusPage } from "./network-status";

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
