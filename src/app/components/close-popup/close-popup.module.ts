import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { ClosePopupComponent } from "./close-popup";

@NgModule({
	declarations: [ClosePopupComponent],
	imports: [IonicModule, CommonModule],
	exports: [ClosePopupComponent],
})
export class ClosePopupComponentModule {}
