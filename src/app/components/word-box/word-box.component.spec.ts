import {
	byTestId,
	createHostComponentFactory,
	SpectatorHost,
} from "@ngneat/spectator";

import { WordBoxComponent } from "./word-box.component";

describe("Word Box", () => {
	let spectator: SpectatorHost<WordBoxComponent>;
	const createHost = createHostComponentFactory({
		component: WordBoxComponent,
	});

	it("should create", () => {
		spectator = createHost(
			`<word-box [order]="order" [word]="word"></word-box>`,
			{
				hostProps: {
					order: 1,
					word: "blame",
				},
			},
		);
		const component = spectator.query(byTestId("word-box"));
		expect(component).toBeTruthy();
	});

	it("should render the word order", () => {
		spectator = createHost(
			`<word-box [order]="order" [word]="word"></word-box>`,
			{
				hostProps: {
					order: 1,
					word: "blame",
				},
			},
		);
		const component = spectator.query(byTestId("word-box__order"));
		expect(component).toHaveText("1");
	});

	it("should render the word", () => {
		spectator = createHost(
			`<word-box [order]="order" [word]="word"></word-box>`,
			{
				hostProps: {
					order: 1,
					word: "blame",
				},
			},
		);
		const component = spectator.query(byTestId("word-box__word"));
		expect(component).toHaveText("blame");
	});
});
