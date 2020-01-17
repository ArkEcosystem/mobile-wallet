import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { LoginPage } from "./login";

import { PinCodeComponentModule } from "@/components/pin-code/pin-code.module";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [LoginPage],
	imports: [
		IonicModule,
		CommonModule,
		RouterModule.forChild([{ path: "", component: LoginPage }]),
		TranslateModule,
		PinCodeComponentModule,
	],
})
export class LoginPageModule {}
