import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared/shared.module";
import { DirectivesModule } from "@/directives/directives.module";
import { TruncateMiddlePipe } from "@/pipes/truncate-middle/truncate-middle";

import { ImportInputComponent } from "./import-input.component";

@NgModule({
	providers: [TruncateMiddlePipe],
	declarations: [ImportInputComponent],
	imports: [IonicModule, SharedModule, DirectivesModule, FormsModule],
	exports: [ImportInputComponent],
})
export class ImportInputComponentModule {}
