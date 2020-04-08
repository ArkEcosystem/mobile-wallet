import { NgModule } from "@angular/core";
import { FingerprintAIO } from "@ionic-native/fingerprint-aio/ngx";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { NgxsModule } from "@ngxs/store";

import { BottomDrawerComponentModule } from "@/components/bottom-drawer/bottom-drawer.module";
import { PipesModule } from "@/pipes/pipes.module";

import { SharedModule } from "../shared.module";
import { AuthLockedComponent } from "./auth-locked/auth-locked.component";
import { AuthPinComponent } from "./auth-pin/auth-pin.component";
import { AuthTouchIdComponent } from "./auth-touch-id/auth-touch-id.component";
import { AuthComponent } from "./auth.component";
import { AuthService } from "./auth.service";
import { AuthState } from "./auth.state";

@NgModule({
	declarations: [
		AuthComponent,
		AuthPinComponent,
		AuthLockedComponent,
		AuthTouchIdComponent,
	],
	imports: [
		IonicModule,
		SharedModule,
		TranslateModule,
		BottomDrawerComponentModule,
		NgxsModule.forFeature([AuthState]),
		PipesModule,
	],
	providers: [AuthService, FingerprintAIO],
	exports: [
		AuthComponent,
		AuthPinComponent,
		AuthLockedComponent,
		AuthTouchIdComponent,
	],
})
export class AuthModule {}
