import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { CustomNetworkCreateModal } from "@/app/modals/custom-network-create/custom-network-create";
import { CustomNetworkCreateModalModule } from "@/app/modals/custom-network-create/custom-network-create.module";
import { PinCodeComponentModule } from "@/components/pin-code/pin-code.module";
import { ViewerLogModalModule } from "@/components/viewer-log/viewer-log.modal.module";

import { SettingsPage } from "./settings";

@NgModule({
	declarations: [SettingsPage],
	imports: [
		IonicModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forChild([{ path: "", component: SettingsPage }]),
		TranslateModule,
		PinCodeComponentModule,
		CustomNetworkCreateModalModule,
		ViewerLogModalModule,
	],
	entryComponents: [CustomNetworkCreateModal],
})
export class SettingsPageModule {}
