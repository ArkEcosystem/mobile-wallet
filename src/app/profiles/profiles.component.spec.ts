import { IonicModule } from "@ionic/angular";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";
import { NgxsModule } from "@ngxs/store";

import { removeLogs } from "@@/test/helpers";

import { ProfileListModule } from "./profile-list/profile-list.module";
import { ProfilesComponent } from "./profiles.component";
import { ProfileState } from "./shared/profile.state";

describe("Profiles", () => {
	let spectator: Spectator<ProfilesComponent>;
	const createComponent = createComponentFactory({
		component: ProfilesComponent,
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			ProfileListModule,
			NgxsModule.forRoot([ProfileState]),
		],
	});

	beforeAll(() => removeLogs());

	beforeEach(() => (spectator = createComponent()));

	it("should create", () => {
		expect(spectator.component).toBeTruthy();
	});
});
