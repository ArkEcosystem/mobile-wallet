import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared.module";

import { ViewerLogComponentModule } from "./viewer-log.component.module";
import { ViewerLogModal } from "./viewer-log.modal";

@NgModule({
	declarations: [ViewerLogModal],
	imports: [IonicModule, SharedModule, ViewerLogComponentModule],
	exports: [ViewerLogModal],
})
export class ViewerLogModalModule {}
