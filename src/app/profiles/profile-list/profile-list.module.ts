import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { SharedModule } from "@/app/shared/shared.module";

import { ProfileListComponent } from "./profile-list.component";

@NgModule({
	declarations: [ProfileListComponent],
	imports: [SharedModule, RouterModule],
	exports: [ProfileListComponent],
	providers: [],
})
export class ProfileListModule {}
