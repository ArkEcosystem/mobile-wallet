import { createServiceFactory, SpectatorService } from "@ngneat/spectator";

import * as walletsFixtures from "@@/test/fixture/wallets.fixture";

import { ForgeProvider } from "./forge";

describe("Forge Service", () => {
	let spectator: SpectatorService<ForgeProvider>;
	const createService = createServiceFactory({
		service: ForgeProvider,
	});

	beforeEach(() => (spectator = createService()));

	it("should generate initial vendor", () => {
		expect(spectator.service.generateIv()).toEqual(jasmine.any(String));
	});

	it("should generate random initial vendors", () => {
		const iv = spectator.service.generateIv();
		const iv2 = spectator.service.generateIv();
		expect(iv).not.toEqual(iv2);
	});

	it("should encrypt", () => {
		const { iv, address, cipherKey } = walletsFixtures.wallet3;
		const message = "secret";
		const password = "123";
		const cipher = spectator.service.encrypt(
			message,
			password,
			address,
			iv,
		);
		expect(cipher).toEqual(cipherKey);
	});

	it("should decrypt", () => {
		const { iv, address, cipherKey } = walletsFixtures.wallet3;
		const password = "123";
		const message = spectator.service.decrypt(
			cipherKey,
			password,
			address,
			iv,
		);
		expect(message).toEqual("secret");
	});
});
