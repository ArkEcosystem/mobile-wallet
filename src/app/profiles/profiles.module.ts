import { NgModule } from "@angular/core";

import { ProfilesRoutingModule } from "./profiles-routing.module";
import { ProfilesComponent } from "./profiles.component";

@NgModule({
	declarations: [ProfilesComponent],
	imports: [ProfilesRoutingModule],
	exports: [],
	providers: [],
})
export class ProfilesModule {}
