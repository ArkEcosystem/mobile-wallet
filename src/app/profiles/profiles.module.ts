import { NgModule } from "@angular/core";

import { SharedModule } from "../shared/shared.module";
import { ProfilesRoutingModule } from "./profiles-routing.module";
import { ProfilesComponent } from "./profiles.component";

@NgModule({
	declarations: [ProfilesComponent],
	imports: [SharedModule, ProfilesRoutingModule],
	exports: [],
	providers: [],
})
export class ProfilesModule {}
