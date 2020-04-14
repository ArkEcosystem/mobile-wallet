import {
	byTestId,
	createHostComponentFactory,
	SpectatorHost,
} from "@ngneat/spectator";

import { IdenticonComponent } from "./identicon.component";

describe("Identicon", () => {
	let spectator: SpectatorHost<IdenticonComponent>;
	const createHost = createHostComponentFactory({
		component: IdenticonComponent,
	});

	it("should create", () => {
		spectator = createHost(`<identicon value="abc"></identicon>`);
		const el = spectator.query(byTestId("c-identicon"));
		// @ts-ignore
		expect(el.style).toEqual(
			jasmine.objectContaining({
				backgroundImage: jasmine.any(String),
			}),
		);
	});

	it("should be different", () => {
		spectator = createHost(`
			<identicon value="abc"></identicon>
			<identicon value="cba"></identicon>
		`);
		const identicons = spectator.queryHostAll(byTestId("c-identicon"));
		// @ts-ignore
		const styles: CSSStyleDeclaration[] = identicons.map((el) => el.style);
		expect(styles[0].backgroundImage).not.toEqual(
			styles[1].backgroundImage,
		);
	});

	it("should not contain undefined or NaN", () => {
		spectator = createHost(`<identicon value="abc"></identicon>`);
		const el = spectator.query(byTestId("c-identicon"));
		// @ts-ignore
		const style: CSSStyleDeclaration = el.style;
		expect(style.backgroundImage.includes("undefined")).toBeFalse();
		expect(style.backgroundImage.includes("NaN")).toBeFalse();
	});
});
