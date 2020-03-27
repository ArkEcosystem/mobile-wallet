import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared.module";
import { DirectivesModule } from "@/directives/directives.module";
import { TruncateMiddlePipe } from "@/pipes/truncate-middle/truncate-middle";

import { InputAddressComponent } from "./input-address.component";

@NgModule({
	providers: [TruncateMiddlePipe],
	declarations: [InputAddressComponent],
	imports: [IonicModule, SharedModule, DirectivesModule, FormsModule],
	exports: [InputAddressComponent],
})
export class InputAddressComponentModule {}
