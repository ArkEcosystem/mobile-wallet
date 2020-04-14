import { IonicModule } from "@ionic/angular";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { removeLogs } from "@@/test/helpers";

import { AuthTouchIdComponent } from "./auth-touch-id.component";

describe("Auth Touch Id Component", () => {
	let spectator: SpectatorHost<AuthTouchIdComponent>;
	const createHost = createHostFactory({
		component: AuthTouchIdComponent,
		imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
	});

	beforeAll(() => removeLogs());

	it("should create", () => {
		spectator = createHost(`<auth-touch-id></auth-touch-id>`);
		expect(spectator.component).toBeTruthy();
	});
});
