import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { SettingsPage } from "./settings";

import { CustomNetworkCreateModal } from "@/app/modals/custom-network-create/custom-network-create";
import { CustomNetworkCreateModalModule } from "@/app/modals/custom-network-create/custom-network-create.module";
import { PinCodeComponentModule } from "@/components/pin-code/pin-code.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

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
	],
	entryComponents: [CustomNetworkCreateModal],
})
export class SettingsPageModule {}
