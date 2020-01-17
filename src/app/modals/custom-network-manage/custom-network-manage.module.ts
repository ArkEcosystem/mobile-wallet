import { CustomNetworkComponentModule } from "@/components/custom-network/custom-network.module";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { CustomNetworkManageModal } from "./custom-network-manage";

@NgModule({
	declarations: [CustomNetworkManageModal],
	imports: [
		IonicModule,
		FormsModule,
		CommonModule,
		TranslateModule,
		CustomNetworkComponentModule,
	],
	exports: [CustomNetworkManageModal],
})
export class CustomNetworkManageModalModule {}
