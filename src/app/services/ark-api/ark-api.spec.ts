import { HTTP } from "@ionic-native/http/ngx";
import {
	createHttpFactory,
	mockProvider,
	SpectatorHttp,
} from "@ngneat/spectator";
import { TranslateService } from "@ngx-translate/core";
import { of, Subject } from "rxjs";

import delegatesFixture from "@@/test/fixture/delegates.fixture";
import * as profilesFixtures from "@@/test/fixture/profiles.fixture";
import feesFixture from "@@/test/fixture/transactions-fees.fixture";
import {
	STORAGE_DELEGATES,
	STORAGE_FEES,
	STORAGE_PROFILES,
} from "@/app/app.constants";
import { FeeStatistic, StoredNetwork } from "@/models/model";
import { NetworkProvider } from "@/services/network/network";
import { StorageProvider } from "@/services/storage/storage";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataService } from "@/services/user-data/user-data.interface";
import { HttpClient } from "@/utils/ark-http-client";

import ArkClient from "../../utils/ark-client";
import { ArkApiProvider } from "./ark-api";

const VALID_ADDRESS = "AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9";
const PUBLIC_KEY =
	"02d29ba7ebe8823137f31ed8e71288274a1cefa23a98a94fa62d4124817d58b777";

describe("ARK API", () => {
	let arkApiSpectator: SpectatorHttp<ArkApiProvider>;
	let arkApiService: ArkApiProvider;

	const currentNetwork = new StoredNetwork();
	//Mock Current Network
	currentNetwork.type = null;
	currentNetwork.activePeer = {
		ip: "127.0.0.1",
		port: 4003,
	};
	currentNetwork.version = 30;
	currentNetwork.name = "custom";

	const createArkApiMock = createHttpFactory({
		service: ArkApiProvider,
		mocks: [ToastProvider, TranslateService, ArkClient],
		providers: [
			mockProvider(NetworkProvider),
			mockProvider(HTTP),
			mockProvider(UserDataService, {
				currentNetwork,
				onUpdateNetwork$: new Subject(),
				onActivateNetwork$: new Subject(),
			}),
			mockProvider(StorageProvider, {
				getObject: (prop: string) => {
					switch (prop) {
						case STORAGE_PROFILES:
							return of(profilesFixtures);
						case STORAGE_DELEGATES:
							return of(delegatesFixture);
						case STORAGE_FEES:
							return of(feesFixture);
					}
				},
				set: () => of(true),
			}),
		],
	});

	beforeEach(function () {
		arkApiSpectator = createArkApiMock();
		arkApiService = arkApiSpectator.service;
	});

	it("should get the current network", () => {
		const spy = spyOn(HttpClient.prototype, "get" as any).and.callThrough();

		const userDataService = arkApiSpectator.get(UserDataService);
		userDataService.onActivateNetwork$.next(currentNetwork);

		expect(spy.calls.argsFor(0)[0]).toEqual(
			"http://127.0.0.1:4003/api/peers",
		);
		expect(spy.calls.argsFor(1)[0]).toEqual(
			"http://127.0.0.1:4003/api/transactions/fees",
		);
		expect(arkApiService.network.name).toEqual("custom");
	});

	it("should return if no network specified", () => {
		const userDataService = arkApiSpectator.get(UserDataService);
		userDataService.onActivateNetwork$.next();

		expect(arkApiService.network).toEqual(undefined);
	});

	it("should get the current client before the intialization", () => {
		expect(arkApiService.client).toBeUndefined();
	});

	it("should return the transaction builder", () => {
		const spy = spyOn(HttpClient.prototype, "get" as any).and.callThrough();

		const userDataService = arkApiSpectator.get(UserDataService);
		userDataService.onActivateNetwork$.next(currentNetwork);

		expect(spy.calls.argsFor(0)[0]).toEqual(
			"http://127.0.0.1:4003/api/peers",
		);
		expect(spy.calls.argsFor(1)[0]).toEqual(
			"http://127.0.0.1:4003/api/transactions/fees",
		);
		expect(arkApiService.transactionBuilder).not.toEqual(null);
	});

	it("should return empty if no network to the fee statistics", async () => {
		const spy = spyOn(HttpClient.prototype, "get" as any).and.callThrough();

		const userDataService = arkApiSpectator.get(UserDataService);
		userDataService.onActivateNetwork$.next(currentNetwork);

		expect(spy.calls.argsFor(0)[0]).toEqual(
			"http://127.0.0.1:4003/api/peers",
		);
		expect(spy.calls.argsFor(1)[0]).toEqual(
			"http://127.0.0.1:4003/api/transactions/fees",
		);

		await arkApiService.feeStatistics.toPromise();
	});

	it("should fetch network fee statistics", async () => {
		const spy = spyOn(HttpClient.prototype, "get" as any).and.callThrough();

		const userDataService = arkApiSpectator.get(UserDataService);
		currentNetwork.isV2 = true;
		userDataService.onActivateNetwork$.next(currentNetwork);

		await arkApiService.feeStatistics.toPromise();

		expect(spy.calls.argsFor(0)[0]).toEqual(
			"http://127.0.0.1:4003/api/peers",
		);
		expect(spy.calls.argsFor(1)[0]).toEqual(
			"http://127.0.0.1:4003/api/transactions/fees",
		);
		expect(spy.calls.argsFor(2)[0]).toEqual(
			"http://127.0.0.1:4003/api/node/fees?days=7",
		);
	});

	it("should return network fee statistics", async () => {
		const spy = spyOn(HttpClient.prototype, "get" as any).and.callThrough();

		const userDataService = arkApiSpectator.get(UserDataService);
		// Mock FeeStatistic
		const networkFeeStatistic: FeeStatistic = {
			type: 0,
			fees: {
				minFee: 0,
				maxFee: 1,
				avgFee: 0.5,
			},
		};
		currentNetwork.feeStatistics = [networkFeeStatistic];
		userDataService.onActivateNetwork$.next(currentNetwork);

		expect(await arkApiService.feeStatistics.toPromise()).toEqual([
			networkFeeStatistic,
		]);
		expect(spy.calls.argsFor(0)[0]).toEqual(
			"http://127.0.0.1:4003/api/peers",
		);
		expect(spy.calls.argsFor(1)[0]).toEqual(
			"http://127.0.0.1:4003/api/transactions/fees",
		);
	});

	it("should fetch and return fees", async () => {
		const spy = spyOn(HttpClient.prototype, "get" as any).and.callThrough();

		const userDataService = arkApiSpectator.get(UserDataService);
		userDataService.onActivateNetwork$.next(currentNetwork);

		expect(spy.calls.argsFor(0)[0]).toEqual(
			"http://127.0.0.1:4003/api/peers",
		);
		expect(spy.calls.argsFor(1)[0]).toEqual(
			"http://127.0.0.1:4003/api/transactions/fees",
		);
		expect(await arkApiService.fees.toPromise()).not.toEqual(null);
		expect(spy.calls.argsFor(2)[0]).toEqual(
			"http://127.0.0.1:4003/api/transactions/fees",
		);
	});

	it("should return cached fees", async () => {
		const spy = spyOn(HttpClient.prototype, "get" as any).and.callThrough();

		const userDataService = arkApiSpectator.get(UserDataService);
		// First call to trigger fetchFees
		userDataService.onActivateNetwork$.next(currentNetwork);

		expect(spy.calls.argsFor(0)[0]).toEqual(
			"http://127.0.0.1:4003/api/peers",
		);
		expect(spy.calls.argsFor(1)[0]).toEqual(
			"http://127.0.0.1:4003/api/transactions/fees",
		);

		// Should be using existent value instead of fetch again
		expect(await arkApiService.fees.toPromise()).not.toEqual(null);
	});

	xit("should fetch and return delegates", async () => {
		const spy = spyOn(HttpClient.prototype, "get" as any).and.callThrough();

		const userDataService = arkApiSpectator.get(UserDataService);
		currentNetwork.activeDelegates = 1;
		userDataService.onActivateNetwork$.next(currentNetwork);

		expect(spy.calls.argsFor(0)[0]).toEqual(
			"http://127.0.0.1:4003/api/peers",
		);
		expect(spy.calls.argsFor(1)[0]).toEqual(
			"http://127.0.0.1:4003/api/transactions/fees",
		);
		expect(await arkApiService.delegates.toPromise()).not.toEqual(null);
		expect(spy.calls.argsFor(2)[0]).toEqual(
			"http://127.0.0.1:4003/api/delegates?limit=51&page=1",
		);
	});

	it("should validate an address", () => {
		const spy = spyOn(HttpClient.prototype, "get" as any).and.callThrough();

		// Set version and activate network
		const userDataService = arkApiSpectator.get(UserDataService);
		currentNetwork.version = 23;
		userDataService.onActivateNetwork$.next(currentNetwork);

		expect(spy.calls.argsFor(0)[0]).toEqual(
			"http://127.0.0.1:4003/api/peers",
		);
		expect(spy.calls.argsFor(1)[0]).toEqual(
			"http://127.0.0.1:4003/api/transactions/fees",
		);
		expect(arkApiService.validateAddress(VALID_ADDRESS)).toEqual(true);
	});

	it("should get a delegate by public key", async () => {
		const spy = spyOn(HttpClient.prototype, "get" as any).and.callThrough();

		// Activate network to have a client
		const userDataService = arkApiSpectator.get(UserDataService);
		userDataService.onActivateNetwork$.next(currentNetwork);

		expect(spy.calls.argsFor(0)[0]).toEqual(
			"http://127.0.0.1:4003/api/peers",
		);
		expect(spy.calls.argsFor(1)[0]).toEqual(
			"http://127.0.0.1:4003/api/transactions/fees",
		);

		const data = await arkApiService
			.getDelegateByPublicKey(PUBLIC_KEY)
			.toPromise();

		expect(data.username).toEqual(delegatesFixture[0].username);
		expect(spy.calls.argsFor(2)[0]).toEqual(
			"http://127.0.0.1:4003/api/delegates/02d29ba7ebe8823137f31ed8e71288274a1cefa23a98a94fa62d4124817d58b777",
		);
	});
});
