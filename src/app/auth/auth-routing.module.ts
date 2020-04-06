import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AuthPinComponent } from "./auth-pin/auth-pin.component";
import { AuthTouchIdComponent } from "./auth-touch-id/auth-touch-id.component";

@NgModule({
	imports: [
		RouterModule.forChild([
			{ path: "", redirectTo: "pin", pathMatch: "full" },
			{
				path: "pin",
				component: AuthPinComponent,
			},
			{
				path: "touch-id",
				component: AuthTouchIdComponent,
			},
		]),
	],
	exports: [RouterModule],
})
export class AuthRoutingModule {}
