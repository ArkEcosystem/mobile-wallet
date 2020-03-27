import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { DirectivesModule } from "@/directives/directives.module";

import { CustomNetworkEditModal } from "./custom-network-edit";

@NgModule({
	declarations: [CustomNetworkEditModal],
	imports: [
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		DirectivesModule,
		TranslateModule,
	],
	exports: [CustomNetworkEditModal],
})
export class CustomNetworkEditModalModule {}
