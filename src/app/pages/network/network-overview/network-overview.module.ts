import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";

import { CustomNetworkCreateModal } from "@/app/modals/custom-network-create/custom-network-create";
import { CustomNetworkCreateModalModule } from "@/app/modals/custom-network-create/custom-network-create.module";
import { CustomNetworkEditModal } from "@/app/modals/custom-network-edit/custom-network-edit";
import { CustomNetworkEditModalModule } from "@/app/modals/custom-network-edit/custom-network-edit.module";
import { SharedModule } from "@/app/shared.module";
import { AddressListComponentModule } from "@/components/address-list/address-list.module";
import { EmptyListComponentModule } from "@/components/empty-list/empty-list.module";

import { NetworkOverviewPage } from "./network-overview.page";

@NgModule({
	declarations: [NetworkOverviewPage],
	imports: [
		IonicModule,
		SharedModule,
		EmptyListComponentModule,
		AddressListComponentModule,
		RouterModule.forChild([{ path: "", component: NetworkOverviewPage }]),
		CustomNetworkEditModalModule,
		CustomNetworkCreateModalModule,
	],
	entryComponents: [CustomNetworkEditModal, CustomNetworkCreateModal],
})
export class NetworkOverviewPageModule {}
