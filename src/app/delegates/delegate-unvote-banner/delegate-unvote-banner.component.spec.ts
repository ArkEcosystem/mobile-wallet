import { IonicModule } from "@ionic/angular";
import { byTestId, createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { DelegateUnvoteBannerComponent } from "./delegate-unvote-banner.component";

describe("Delegate Unvote Banner", () => {
	let spectator: SpectatorHost<DelegateUnvoteBannerComponent>;
	const createHost = createHostFactory({
		component: DelegateUnvoteBannerComponent,
		imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
	});

	it("should create", () => {
		spectator = createHost(
			`<delegate-unvote-banner username="Test"></delegate-unvote-banner>`,
		);
		const usernameEl = spectator.query(
			byTestId("delegate-unvote-banner__username"),
		);
		expect(usernameEl).toHaveText("Test");
	});

	it("should emit event on click", () => {
		spectator = createHost(
			`<delegate-unvote-banner username="Test"></delegate-unvote-banner>`,
		);

		let output: any;
		spectator
			.output("delegateUnvoteBannerClick")
			.subscribe((result) => (output = result));

		const unvoteBtn = spectator.query(
			byTestId("delegate-unvote-banner__unvote"),
		);
		spectator.click(unvoteBtn);
		expect(output).toEqual("Test");
	});
});
