import { NgModule } from "@angular/core";

import { SharedModule } from "@/app/shared/shared.module";

import { ProfileListComponent } from "./profile-list.component";

@NgModule({
	declarations: [ProfileListComponent],
	imports: [SharedModule],
	exports: [ProfileListComponent],
	providers: [],
})
export class ProfileListModule {}
