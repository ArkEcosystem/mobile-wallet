import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared/shared.module";
import { DirectivesModule } from "@/directives/directives.module";

import { Alert } from "./alert.component";

@NgModule({
	declarations: [Alert],
	imports: [IonicModule, SharedModule, DirectivesModule],
	exports: [Alert],
})
export class AlertModule {}
