import { NgModule } from "@angular/core";

import { NgxsModule } from "@ngxs/store";
import { SharedModule } from "../shared/shared.module";
import { LoginService } from "./shared/login.service";
import { LoginState } from "./shared/login.state";

@NgModule({
	declarations: [],
	providers: [LoginService],
	imports: [SharedModule, NgxsModule.forFeature([LoginState])],
})
export class LoginModule {}
