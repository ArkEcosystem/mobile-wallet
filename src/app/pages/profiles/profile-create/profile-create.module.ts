import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { CustomNetworkComponentModule } from "@/components/custom-network/custom-network.module";
import { DirectivesModule } from "@/directives/directives.module";

import { ProfileCreatePage } from "./profile-create";

@NgModule({
	declarations: [ProfileCreatePage],
	imports: [
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		RouterModule.forChild([{ path: "", component: ProfileCreatePage }]),
		TranslateModule,
		DirectivesModule,
		CustomNetworkComponentModule,
	],
})
export class ProfileCreatePageModule {}
