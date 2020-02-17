import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { GenerateEntropyModal } from "./generate-entropy";

import { ComponentsModule } from "@/components/components.module";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [GenerateEntropyModal],
	imports: [IonicModule, CommonModule, TranslateModule, ComponentsModule],
	exports: [GenerateEntropyModal],
})
export class GenerateEntropyModalModule {}
