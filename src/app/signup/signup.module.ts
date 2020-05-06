import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "../shared/shared.module";
import { SignupRoutingModule } from "./signup-routing.module";
import { SignupComponent } from "./signup.component";

@NgModule({
	declarations: [SignupComponent],
	imports: [IonicModule, SharedModule, SignupRoutingModule],
	providers: [],
	exports: [],
})
export class SignupModule {}
