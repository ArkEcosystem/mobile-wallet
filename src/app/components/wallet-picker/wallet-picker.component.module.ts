import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared.module";
import { PipesModule } from "@/pipes/pipes.module";

import { WalletPickerComponent } from "./wallet-picker.component";

@NgModule({
	declarations: [WalletPickerComponent],
	imports: [IonicModule, SharedModule, PipesModule],
	exports: [WalletPickerComponent],
})
export class WalletPickerComponentModule {}
