import { createServiceFactory, SpectatorService } from "@ngneat/spectator";

import { ArkApiProvider } from "@/services/ark-api/ark-api";
import { NeoApiProvider } from "@/services/neo-api/neo-api";
import { NetworkProvider } from "@/services/network/network";
import { UserDataServiceImpl } from "@/services/user-data/user-data";

import { AddressCheckerProvider } from "./address-checker";

const VALID_ADDRESS = "D8x2Rno1CxrE5kRoVHS1EooQnfTL3v5ZyM";

describe("Address checker service", () => {
	let spectator: SpectatorService<AddressCheckerProvider>;
	const createService = createServiceFactory({
		service: AddressCheckerProvider,
		mocks: [
			UserDataServiceImpl,
			NetworkProvider,
			ArkApiProvider,
			NeoApiProvider,
		],
	});

	beforeEach(() => (spectator = createService()));

	it("should check address", () => {
		expect(spectator.service.checkAddress(VALID_ADDRESS)).toBeFalsy();
	});
});
