import { NgModule } from "@angular/core";
import { IntroPage } from "./intro.component";

import { NgxsModule } from "@ngxs/store";
import { SharedModule } from "../shared/shared.module";
import { IntroRoutingModule } from "./intro-routing.module";
import { IntroService } from "./shared/intro.service";
import { IntroState } from "./shared/intro.state";

@NgModule({
	declarations: [IntroPage],
	providers: [IntroService],
	imports: [
		SharedModule,
		NgxsModule.forFeature([IntroState]),
		IntroRoutingModule,
	],
})
export class IntroModule {}
