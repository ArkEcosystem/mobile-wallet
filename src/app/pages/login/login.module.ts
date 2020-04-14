import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared.module";

import { LoginPage } from "./login";

@NgModule({
	declarations: [LoginPage],
	imports: [
		IonicModule,
		SharedModule,
		RouterModule.forChild([{ path: "", component: LoginPage }]),
	],
})
export class LoginPageModule {}
