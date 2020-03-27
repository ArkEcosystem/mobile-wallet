import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared.module";

import { ViewerLogComponent } from "./viewer-log.component";

@NgModule({
	declarations: [ViewerLogComponent],
	imports: [IonicModule, SharedModule],
	exports: [ViewerLogComponent],
})
export class ViewerLogComponentModule {}
