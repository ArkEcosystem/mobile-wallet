import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ProfileCreatePage } from "./profile-create";

import { CustomNetworkComponentModule } from "@/components/custom-network/custom-network.module";
import { DirectivesModule } from "@/directives/directives.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

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
