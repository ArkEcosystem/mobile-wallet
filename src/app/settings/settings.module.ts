import { NgModule } from "@angular/core";

import { CustomNetworkCreateModal } from "@/app/modals/custom-network-create/custom-network-create";
import { CustomNetworkCreateModalModule } from "@/app/modals/custom-network-create/custom-network-create.module";
import { PinCodeComponentModule } from "@/components/pin-code/pin-code.module";
import { NgxsModule } from "@ngxs/store";
import { SharedModule } from "../shared/shared.module";
import { SettingsRoutingModule } from "./settings-routing.module";
import { SettingsComponent } from "./settings.component";
import { SettingsState } from "./shared/settings.state";

@NgModule({
	declarations: [SettingsComponent],
	imports: [
		SharedModule,
		SettingsRoutingModule,
		NgxsModule.forFeature([SettingsState]),
		PinCodeComponentModule,
		CustomNetworkCreateModalModule,
	],
	entryComponents: [CustomNetworkCreateModal],
})
export class SettingsModule {}
