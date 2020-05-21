import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { NgxsModule } from "@ngxs/store";

import { CustomNetworkCreateModal } from "@/app/modals/custom-network-create/custom-network-create";
import { CustomNetworkCreateModalModule } from "@/app/modals/custom-network-create/custom-network-create.module";
import { ViewerLogModalModule } from "@/components/viewer-log/viewer-log.modal.module";

import { SettingsRoutingModule } from "./settings-routing.module";
import { SettingsComponent } from "./settings.component";
import { SettingsState } from "./shared/settings.state";

@NgModule({
	declarations: [SettingsComponent],
	providers: [],
	imports: [
		IonicModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TranslateModule,
		CustomNetworkCreateModalModule,
		ViewerLogModalModule,
		SettingsRoutingModule,
		NgxsModule.forFeature([SettingsState]),
	],
	entryComponents: [CustomNetworkCreateModal],
})
export class SettingsModule {}
