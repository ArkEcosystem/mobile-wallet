import { NgModule } from "@angular/core";

import { NgxsModule } from "@ngxs/store";
import { SharedModule } from "../shared/shared.module";
import { AuthService } from "./shared/auth.service";
import { AuthState } from "./shared/auth.state";

@NgModule({
	declarations: [],
	providers: [AuthService],
	imports: [SharedModule, NgxsModule.forFeature([AuthState])],
})
export class AuthModule {}
