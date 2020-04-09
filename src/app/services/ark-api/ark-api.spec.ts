import {
	createHttpFactory,
	HttpMethod,
	mockProvider,
	SpectatorHttp,
} from "@ngneat/spectator";
import { TranslateService } from "@ngx-translate/core";
import { of, Subject } from "rxjs";

import delegatesFixture from "@@/test/fixture/delegates.fixture";
import feesFixture from "@@/test/fixture/transactions-fees.fixture";
import { STORAGE_DELEGATES, STORAGE_FEES } from "@/app/app.constants";
import { FeeStatistic, StoredNetwork } from "@/models/model";
import { NetworkProvider } from "@/services/network/network";
import { StorageProvider } from "@/services/storage/storage";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataService } from "@/services/user-data/user-data.interface";

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
			mockProvider(UserDataService, {
				currentNetwork,
				onUpdateNetwork$: new Subject(),
				onActivateNetwork$: new Subject(),
			}),
			mockProvider(StorageProvider, {
				getObject: (prop: string) => {
					switch (prop) {
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

	beforeEach(() => {
		arkApiSpectator = createArkApiMock();
		arkApiService = arkApiSpectator.service;
	});

	it("should get the current network", () => {
		const userDataService = arkApiSpectator.get(UserDataService);
		userDataService.onActivateNetwork$.next(currentNetwork);
		arkApiSpectator.expectConcurrent([
			{
				url: "http://127.0.0.1:4003/api/peers",
				method: HttpMethod.GET,
			},
			{
				url: "http://127.0.0.1:4003/api/transactions/fees",
				method: HttpMethod.GET,
			},
		]);
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
		const userDataService = arkApiSpectator.get(UserDataService);
		userDataService.onActivateNetwork$.next(currentNetwork);
		arkApiSpectator.expectConcurrent([
			{
				url: "http://127.0.0.1:4003/api/peers",
				method: HttpMethod.GET,
			},
			{
				url: "http://127.0.0.1:4003/api/transactions/fees",
				method: HttpMethod.GET,
			},
		]);
		expect(arkApiService.transactionBuilder).not.toEqual(null);
	});

	it("should return empty if no network to the fee statistics", (done) => {
		const userDataService = arkApiSpectator.get(UserDataService);
		userDataService.onActivateNetwork$.next(currentNetwork);
		arkApiSpectator.expectConcurrent([
			{
				url: "http://127.0.0.1:4003/api/peers",
				method: HttpMethod.GET,
			},
			{
				url: "http://127.0.0.1:4003/api/transactions/fees",
				method: HttpMethod.GET,
			},
		]);
		arkApiService.feeStatistics.subscribe({
			complete: () => done(),
		});
	});

	it("should fetch network fee statistics", (done) => {
		const userDataService = arkApiSpectator.get(UserDataService);
		currentNetwork.isV2 = true;
		userDataService.onActivateNetwork$.next(currentNetwork);

		arkApiService.feeStatistics.subscribe({
			complete: () => done(),
		});

		const reqs = arkApiSpectator.expectConcurrent([
			{
				url: "http://127.0.0.1:4003/api/peers",
				method: HttpMethod.GET,
			},
			{
				url: "http://127.0.0.1:4003/api/transactions/fees",
				method: HttpMethod.GET,
			},
			{
				url: "http://127.0.0.1:4003/api/v2/node/fees?days=7",
				method: HttpMethod.GET,
			},
		]);

		reqs[2].flush({ data: [] });

		done();
	});

	it("should return network fee statistics", (done) => {
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

		arkApiService.feeStatistics.subscribe({
			next: (data) => {
				expect(data).toEqual([networkFeeStatistic]);
				done();
			},
		});

		arkApiSpectator.expectConcurrent([
			{
				url: "http://127.0.0.1:4003/api/peers",
				method: HttpMethod.GET,
			},
			{
				url: "http://127.0.0.1:4003/api/transactions/fees",
				method: HttpMethod.GET,
			},
		]);
	});

	it("should fetch and return fees", (done) => {
		const userDataService = arkApiSpectator.get(UserDataService);
		userDataService.onActivateNetwork$.next(currentNetwork);

		arkApiSpectator.expectConcurrent([
			{
				url: "http://127.0.0.1:4003/api/peers",
				method: HttpMethod.GET,
			},
			{
				url: "http://127.0.0.1:4003/api/transactions/fees",
				method: HttpMethod.GET,
			},
		]);

		arkApiService.fees.subscribe({
			next: (data) => {
				expect(data).not.toEqual(null);
				done();
			},
		});

		const req = arkApiSpectator.expectOne(
			"http://127.0.0.1:4003/api/transactions/fees",
			HttpMethod.GET,
		);

		req.flush(feesFixture);
	});

	it("should return cached fees", (done) => {
		const userDataService = arkApiSpectator.get(UserDataService);
		// First call to trigger fetchFees
		userDataService.onActivateNetwork$.next(currentNetwork);

		const reqs = arkApiSpectator.expectConcurrent([
			{
				url: "http://127.0.0.1:4003/api/peers",
				method: HttpMethod.GET,
			},
			{
				url: "http://127.0.0.1:4003/api/transactions/fees",
				method: HttpMethod.GET,
			},
		]);

		reqs[1].flush(feesFixture);

		// Should be using existent value instead of fetch again
		arkApiService.fees.subscribe({
			next: (data) => {
				expect(data).not.toEqual(null);
				done();
			},
		});
	});

	xit("should fetch and return delegates", (done) => {
		const userDataService = arkApiSpectator.get(UserDataService);
		currentNetwork.activeDelegates = 1;
		userDataService.onActivateNetwork$.next(currentNetwork);

		arkApiSpectator.expectConcurrent([
			{
				url: "http://127.0.0.1:4003/api/peers",
				method: HttpMethod.GET,
			},
			{
				url: "http://127.0.0.1:4003/api/transactions/fees",
				method: HttpMethod.GET,
			},
		]);

		arkApiService.delegates.subscribe({
			next: (data) => {
				expect(data).not.toEqual(null);
				done();
			},
		});

		const req = arkApiSpectator.expectOne(
			"http://127.0.0.1:4003/api/delegates?limit=51&page=1",
			HttpMethod.GET,
		);
		req.flush(delegatesFixture);
	});

	xit("should validate an address", () => {
		// Set version and activate network
		const userDataService = arkApiSpectator.get(UserDataService);
		currentNetwork.version = 30;
		userDataService.onActivateNetwork$.next(currentNetwork);

		arkApiSpectator.expectConcurrent([
			{
				url: "http://127.0.0.1:4003/api/peers",
				method: HttpMethod.GET,
			},
			{
				url: "http://127.0.0.1:4003/api/transactions/fees",
				method: HttpMethod.GET,
			},
		]);

		expect(arkApiService.validateAddress(VALID_ADDRESS)).toEqual(true);
	});

	it("should get a delegate by public key", (done) => {
		// Activate network to have a client
		const userDataService = arkApiSpectator.get(UserDataService);
		userDataService.onActivateNetwork$.next(currentNetwork);

		arkApiSpectator.expectConcurrent([
			{
				url: "http://127.0.0.1:4003/api/peers",
				method: HttpMethod.GET,
			},
			{
				url: "http://127.0.0.1:4003/api/transactions/fees",
				method: HttpMethod.GET,
			},
		]);

		arkApiService.getDelegateByPublicKey(PUBLIC_KEY).subscribe({
			next: (data) => {
				expect(data.username).toEqual(delegatesFixture[0].username);
				done();
			},
		});

		const req = arkApiSpectator.expectOne(
			"http://127.0.0.1:4003/api/delegates/02d29ba7ebe8823137f31ed8e71288274a1cefa23a98a94fa62d4124817d58b777",
			HttpMethod.GET,
		);

		req.flush({ data: delegatesFixture[0] });
	});
});
