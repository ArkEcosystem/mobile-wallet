import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { WordBoxComponent } from "./word-box.component";

@NgModule({
	declarations: [WordBoxComponent],
	imports: [IonicModule, CommonModule],
	exports: [WordBoxComponent],
})
export class WordBoxComponentModule {}
