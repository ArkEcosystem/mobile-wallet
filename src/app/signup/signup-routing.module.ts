import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { SignupComponent } from "./signup.component";

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: "",
				component: SignupComponent,
			},
		]),
	],
	exports: [],
})
export class SignupRoutingModule {}
