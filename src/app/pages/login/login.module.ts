import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { LoginPage } from "./login";

import { SharedModule } from "@/app/shared.module";
import { PinCodeComponentModule } from "@/components/pin-code/pin-code.module";
import { RouterModule } from "@angular/router";

@NgModule({
	declarations: [LoginPage],
	imports: [
		IonicModule,
		SharedModule,
		RouterModule.forChild([{ path: "", component: LoginPage }]),
		PinCodeComponentModule,
	],
})
export class LoginPageModule {}
