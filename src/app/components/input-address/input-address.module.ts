import { SharedModule } from "@/app/shared.module";
import { DirectivesModule } from "@/directives/directives.module";
import { TruncateMiddlePipe } from "@/pipes/truncate-middle/truncate-middle";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { InputAddressComponent } from "./input-address.component";

@NgModule({
	providers: [TruncateMiddlePipe],
	declarations: [InputAddressComponent],
	imports: [IonicModule, SharedModule, DirectivesModule],
	exports: [InputAddressComponent],
})
export class InputAddressComponentModule {}
