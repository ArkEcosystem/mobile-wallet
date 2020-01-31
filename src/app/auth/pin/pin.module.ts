import { SharedModule } from "@/app/shared/shared.module";
import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { AuthPinComponent } from "./pin.component";
import { AuthPinState } from "./pin.state";

@NgModule({
	declarations: [AuthPinComponent],
	imports: [SharedModule, NgxsModule.forFeature([AuthPinState])],
	exports: [AuthPinComponent],
})
export class AuthPinModule {}
