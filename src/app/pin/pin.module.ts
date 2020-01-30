import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { SharedModule } from "../shared/shared.module";
import { PinComponent } from "./pin.component";
import { PinState } from "./shared/pin.state";

@NgModule({
	declarations: [PinComponent],
	imports: [SharedModule, NgxsModule.forFeature([PinState])],
	exports: [PinComponent],
})
export class PinModule {}
