import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { CustomNetworkCreateModal } from "@/app/modals/custom-network-create/custom-network-create";
import { CustomNetworkCreateModalModule } from "@/app/modals/custom-network-create/custom-network-create.module";
import { ViewerLogModalModule } from "@/components/viewer-log/viewer-log.modal.module";

import { SettingsRoutingModule } from "./settings-routing.module";
import { SettingsPage } from "./settings.component";

@NgModule({
	declarations: [SettingsPage],
	imports: [
		IonicModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TranslateModule,
		CustomNetworkCreateModalModule,
		ViewerLogModalModule,
		SettingsRoutingModule,
	],
	entryComponents: [CustomNetworkCreateModal],
})
export class SettingsPageModule {}
