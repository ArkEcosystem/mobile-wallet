import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";

import { SharedModule } from "@/app/shared/shared.module";

import { ProfileRoutingModule } from "./profile-routing.module";
import { ProfileComponent } from "./profile.component";

@NgModule({
	declarations: [ProfileComponent],
	imports: [IonicModule, SharedModule, ProfileRoutingModule],
})
export class ProfileModule {}
