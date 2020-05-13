import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import {
	byTestId,
	createHostComponentFactory,
	SpectatorHost,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { ProfileListComponent } from "./profile-list.component";

describe("Profile List", () => {
	let spectator: SpectatorHost<ProfileListComponent>;
	const createHost = createHostComponentFactory({
		component: ProfileListComponent,
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			RouterModule.forRoot([]),
		],
	});

	it("should display all profiles", () => {
		const profiles = [{ name: "Test" }, { name: "Ark" }];
		spectator = createHost(
			`<profile-list [profiles]="profiles"></profile-list>`,
			{
				hostProps: {
					profiles,
				},
			},
		);
		const profilesElement = spectator.queryAll(
			byTestId("profile-list__profile"),
		);
		expect(profilesElement).toHaveLength(2);
	});
});
