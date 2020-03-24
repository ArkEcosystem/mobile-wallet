import {
	createServiceFactory,
	mockProvider,
	SpectatorService,
} from "@ngneat/spectator";

// Fixtures
import * as walletsFixtures from "@@/test/fixture/wallets.fixture";
// Models
import { Wallet } from "@/models/model";
// Services
import { ArkApiProvider } from "@/services/ark-api/ark-api";
import { NeoApiProvider } from "@/services/neo-api/neo-api";
import { NetworkProvider } from "@/services/network/network";
import { UserDataServiceImpl } from "@/services/user-data/user-data";
import { UserDataService } from "@/services/user-data/user-data.interface";

import { AddressCheckerProvider } from "./address-checker";

const INVALID_ADDRESS = "D8x2Rno1CxrE5kRoVHS1EooQnfTL3v5sM";
const VALID_ADDRESS = "AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9";
const WALLET_ADDRESS = "AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX";

fdescribe("Address checker service", () => {
	let addressSpectator: SpectatorService<AddressCheckerProvider>;
	let userDataSpectator: SpectatorService<UserDataServiceImpl>;
	let userDataService: UserDataService;
	let addressChecker: AddressCheckerProvider;

	const wallet = new Wallet().deserialize(walletsFixtures.wallet1);

	const createAddressCheckerMock = createServiceFactory({
		service: AddressCheckerProvider,
		mocks: [NetworkProvider, ArkApiProvider, NeoApiProvider],
		providers: [
			mockProvider(UserDataService, {
				currentWallet: wallet,
			}),
		],
	});

	beforeEach(() => {
		addressSpectator = createAddressCheckerMock();
		addressChecker = addressSpectator.service;
	});

	describe("Check address", () => {
		it("should check the address", done => {
			addressChecker.checkAddress(INVALID_ADDRESS).subscribe(data => {
				expect(data.message.key).toEqual("VALIDATION.INVALID_ADDRESS");
				done();
			});
		});

		it("should return the check for own address", done => {
			const networkProvider = addressSpectator.get(NetworkProvider);
			networkProvider.isValidAddress.and.returnValue(true);
			addressChecker.checkAddress(WALLET_ADDRESS).subscribe(data => {
				expect(data.message.key).toEqual("VALIDATION.IS_OWN_ADDRESS");
				done();
			});
		});

		it("should return the check for neo address", done => {
			const networkProvider = addressSpectator.get(NetworkProvider);
			const neoApiProvider = addressSpectator.get(NeoApiProvider);
			networkProvider.isValidAddress.and.returnValue(true);
			neoApiProvider.doesAddressExist.and.returnValue(true);
			addressChecker.checkAddress(WALLET_ADDRESS).subscribe(data => {
				expect(data.message.key).toEqual("VALIDATION.IS_OWN_ADDRESS");
				done();
			});
		});
	});
});
