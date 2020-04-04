import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { NgxsModule } from "@ngxs/store";

import { BottomDrawerComponentModule } from "@/components/bottom-drawer/bottom-drawer.module";

import { SharedModule } from "../shared.module";
import { AuthLockedComponent } from "./auth-locked/auth-locked.component";
import { AuthPinComponent } from "./auth-pin/auth-pin.component";
import { AuthComponent } from "./auth.component";
import { AuthService } from "./auth.service";
import { AuthState } from "./auth.state";

@NgModule({
	declarations: [AuthComponent, AuthPinComponent, AuthLockedComponent],
	imports: [
		IonicModule,
		SharedModule,
		BottomDrawerComponentModule,
		NgxsModule.forFeature([AuthState]),
	],
	providers: [AuthService],
	exports: [AuthComponent, AuthPinComponent, AuthLockedComponent],
})
export class AuthComponentModule {}
