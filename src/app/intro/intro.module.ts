import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";

import { SharedModule } from "../shared/shared.module";
import { IntroRoutingModule } from "./intro-routing.module";
import { IntroPage } from "./intro.component";
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
