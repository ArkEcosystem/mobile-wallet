import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { SharedModule } from "../shared/shared.module";
import { AuthComponent } from "./auth.component";
import { AuthPinModule } from "./pin/pin.module";
import { AuthPinService } from "./pin/pin.service";
import { AuthState } from "./shared/auth.state";

@NgModule({
	declarations: [AuthComponent],
	providers: [AuthPinService],
	imports: [SharedModule, NgxsModule.forFeature([AuthState]), AuthPinModule],
	exports: [AuthComponent],
})
export class AuthModule {}
