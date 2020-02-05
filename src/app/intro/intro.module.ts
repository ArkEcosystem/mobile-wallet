import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { IntroPage } from "./intro.component";

import { SharedModule } from "../shared/shared.module";
import { IntroRoutingModule } from "./intro-routing.module";

@NgModule({
	declarations: [IntroPage],
	imports: [IonicModule, SharedModule, IntroRoutingModule],
})
export class IntroModule {}
