import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { EmptyListComponent } from "./empty-list";

import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [EmptyListComponent],
	imports: [IonicModule, TranslateModule, CommonModule],
	exports: [EmptyListComponent],
})
export class EmptyListComponentModule {}
