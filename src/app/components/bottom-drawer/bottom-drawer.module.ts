import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { BottomDrawerComponent } from "./bottom-drawer.component";

@NgModule({
	declarations: [BottomDrawerComponent],
	imports: [CommonModule],
	exports: [BottomDrawerComponent],
})
export class BottomDrawerComponentModule {}
