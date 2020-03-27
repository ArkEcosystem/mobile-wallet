import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared.module";

import { WalletPickerComponentModule } from "./wallet-picker.component.module";
import { WalletPickerModal } from "./wallet-picker.modal";

@NgModule({
	declarations: [WalletPickerModal],
	imports: [IonicModule, SharedModule, WalletPickerComponentModule],
	exports: [WalletPickerModal],
})
export class WalletPickerModalModule {}
