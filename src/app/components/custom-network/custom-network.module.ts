import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { CustomNetworkCreateModal } from "@/app/modals/custom-network-create/custom-network-create";
import { CustomNetworkCreateModalModule } from "@/app/modals/custom-network-create/custom-network-create.module";
import { CustomNetworkEditModal } from "@/app/modals/custom-network-edit/custom-network-edit";
import { CustomNetworkEditModalModule } from "@/app/modals/custom-network-edit/custom-network-edit.module";

import { CustomNetworkComponent } from "./custom-network";

@NgModule({
	declarations: [CustomNetworkComponent],
	imports: [
		IonicModule,
		FormsModule,
		TranslateModule,
		CommonModule,
		CustomNetworkCreateModalModule,
		CustomNetworkEditModalModule,
	],
	entryComponents: [CustomNetworkEditModal, CustomNetworkCreateModal],
	exports: [CustomNetworkComponent],
})
export class CustomNetworkComponentModule {}
