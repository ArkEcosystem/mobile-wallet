import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { IdenticonComponent } from "./identicon.component";

@NgModule({
	declarations: [IdenticonComponent],
	imports: [CommonModule],
	exports: [IdenticonComponent],
})
export class IdenticonComponentModule {}
