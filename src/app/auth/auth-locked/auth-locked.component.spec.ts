import { IonicModule } from "@ionic/angular";
import { byTestId, createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { removeLogs } from "@@/test/helpers";
import { PipesModule } from "@/pipes/pipes.module";

import { AuthLockedComponent } from "./auth-locked.component";

describe("Auth Locked Component", () => {
	let spectator: SpectatorHost<AuthLockedComponent>;
	const createHost = createHostFactory({
		component: AuthLockedComponent,
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			PipesModule,
		],
	});

	beforeAll(() => removeLogs());

	it("should create", () => {
		spectator = createHost(
			`<auth-locked [remainingSeconds]="30"></auth-locked>`,
		);
		const message = spectator.query(byTestId("c-auth-locked__message"));
		expect(message).toBeTruthy();
	});
});
