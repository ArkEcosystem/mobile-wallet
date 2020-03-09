import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { ComponentsModule } from "@/components/components.module";

import { GenerateEntropyModal } from "./generate-entropy";

@NgModule({
	declarations: [GenerateEntropyModal],
	imports: [IonicModule, CommonModule, TranslateModule, ComponentsModule],
	exports: [GenerateEntropyModal],
})
export class GenerateEntropyModalModule {}
