import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { EmptyListComponent } from "./empty-list";

@NgModule({
	declarations: [EmptyListComponent],
	imports: [IonicModule, TranslateModule, CommonModule],
	exports: [EmptyListComponent],
})
export class EmptyListComponentModule {}
