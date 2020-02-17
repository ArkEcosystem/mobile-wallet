import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { IntroPage } from "./intro";

import { SharedModule } from "@/app/shared.module";
import { RouterModule } from "@angular/router";

@NgModule({
	declarations: [IntroPage],
	imports: [
		IonicModule,
		SharedModule,
		RouterModule.forChild([{ path: "", component: IntroPage }]),
	],
})
export class IntroPageModule {}
