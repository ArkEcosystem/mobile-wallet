import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared.module";

import { IntroPage } from "./intro";

@NgModule({
	declarations: [IntroPage],
	imports: [
		IonicModule,
		SharedModule,
		RouterModule.forChild([{ path: "", component: IntroPage }]),
	],
})
export class IntroPageModule {}
