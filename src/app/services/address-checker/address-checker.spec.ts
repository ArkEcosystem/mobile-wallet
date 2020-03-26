import {
	createServiceFactory,
	createSpyObject,
	mockProvider,
	SpectatorService,
} from "@ngneat/spectator";
import { of, throwError } from "rxjs";

// Fixtures
import transactions from "@@/test/fixture/transactions.fixture";
import * as walletsFixtures from "@@/test/fixture/wallets.fixture";
// Models
import { Wallet } from "@/models/model";
// Services
import { ArkApiProvider } from "@/services/ark-api/ark-api";
import { NeoApiProvider } from "@/services/neo-api/neo-api";
import { NetworkProvider } from "@/services/network/network";
import { UserDataService } from "@/services/user-data/user-data.interface";
import ApiClient from "@/utils/ark-client";

import { AddressCheckerProvider } from "./address-checker";

const INVALID_ADDRESS = "D8x2Rno1CxrE5kRoVHS1EooQnfTL3v5sM";
const WALLET_ADDRESS = "AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX";

describe("Address checker service", () => {
	let addressSpectator: SpectatorService<AddressCheckerProvider>;
	let addressChecker: AddressCheckerProvider;

	const wallet = new Wallet().deserialize(walletsFixtures.wallet1);
	const apiClient = createSpyObject(ApiClient);

	const createAddressCheckerMock = createServiceFactory({
		service: AddressCheckerProvider,
		mocks: [NetworkProvider, NeoApiProvider],
		providers: [
			mockProvider(UserDataService, {
				currentWallet: wallet,
			}),
			mockProvider(ArkApiProvider, {
				client: apiClient,
			}),
		],
	});

	beforeEach(() => {
		addressSpectator = createAddressCheckerMock();
		addressChecker = addressSpectator.service;
	});

	describe("Check address", () => {
		it("should check the address", (done) => {
			addressChecker.checkAddress(INVALID_ADDRESS).subscribe((data) => {
				expect(data.message.key).toEqual("VALIDATION.INVALID_ADDRESS");
				done();
			});
		});

		it("should return the check for own address", (done) => {
			const networkProvider = addressSpectator.get(NetworkProvider);
			networkProvider.isValidAddress.and.returnValue(true);
			addressChecker.checkAddress(WALLET_ADDRESS).subscribe((data) => {
				expect(data.message.key).toEqual("VALIDATION.IS_OWN_ADDRESS");
				done();
			});
		});

		it("should return the check for neo address", (done) => {
			const networkProvider = addressSpectator.get(NetworkProvider);
			const neoApiProvider = addressSpectator.get(NeoApiProvider);
			networkProvider.isValidAddress.and.returnValue(true);
			neoApiProvider.doesAddressExist.and.returnValue(of(true));
			addressChecker.checkAddress(WALLET_ADDRESS).subscribe((data) => {
				expect(data.message.key).toEqual("VALIDATION.IS_OWN_ADDRESS");
				done();
			});
		});

		it("should return the check for no transactions", (done) => {
			const networkProvider = addressSpectator.get(NetworkProvider);
			const neoApiProvider = addressSpectator.get(NeoApiProvider);
			networkProvider.isValidAddress.and.returnValue(true);
			neoApiProvider.doesAddressExist.and.returnValue(of(false));
			apiClient.getTransactionList.and.returnValue(of({}));
			addressChecker
				.checkAddress(walletsFixtures.wallet2.address)
				.subscribe((data) => {
					expect(data.message.key).toEqual(
						"VALIDATION.NO_TRANSACTIONS",
					);
					done();
				});
		});

		it("should not throw error if the transaction request fails", (done) => {
			const networkProvider = addressSpectator.get(NetworkProvider);
			const neoApiProvider = addressSpectator.get(NeoApiProvider);
			networkProvider.isValidAddress.and.returnValue(true);
			neoApiProvider.doesAddressExist.and.returnValue(of(false));
			apiClient.getTransactionList.and.returnValue(throwError("ERROR"));
			addressChecker
				.checkAddress(walletsFixtures.wallet2.address)
				.subscribe((data) => {
					expect(data).toBeUndefined();
					done();
				});
		});

		it("should not throw error if the checked address has transactions", (done) => {
			const networkProvider = addressSpectator.get(NetworkProvider);
			const neoApiProvider = addressSpectator.get(NeoApiProvider);
			networkProvider.isValidAddress.and.returnValue(true);
			neoApiProvider.doesAddressExist.and.returnValue(of(false));
			apiClient.getTransactionList.and.returnValue(
				of({ success: true, transactions }),
			);
			addressChecker
				.checkAddress(walletsFixtures.wallet3.address)
				.subscribe((data) => {
					expect(data).toBeUndefined();
					done();
				});
		});

		it("should use handler if it's an neo address", (done) => {
			const networkProvider = addressSpectator.get(NetworkProvider);
			const neoApiProvider = addressSpectator.get(NeoApiProvider);
			networkProvider.isValidAddress.and.returnValue(true);
			neoApiProvider.doesAddressExist.and.returnValue(of(true));

			addressChecker
				.checkAddress(walletsFixtures.wallet2.address)
				.subscribe((data) => {
					expect(data).toBeUndefined();
					done();
				});
		});

		it("should not use handler if it isn't an neo address", (done) => {
			const networkProvider = addressSpectator.get(NetworkProvider);
			const neoApiProvider = addressSpectator.get(NeoApiProvider);
			networkProvider.isValidAddress.and.returnValue(true);
			neoApiProvider.doesAddressExist.and.returnValue(
				throwError("ERROR"),
			);

			addressChecker
				.checkAddress(walletsFixtures.wallet2.address)
				.subscribe((data) => {
					expect(data).toBeUndefined();
					done();
				});
		});
	});
});
