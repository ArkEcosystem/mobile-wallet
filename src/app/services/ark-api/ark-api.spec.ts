import {
	createHttpFactory,
	HttpMethod,
	mockProvider,
	SpectatorHttp,
} from "@ngneat/spectator";
import { TranslateService } from "@ngx-translate/core";
import { of, Subject } from "rxjs";

import delegatesFixture from "@@/test/fixture/delegates.fixture";
import { STORAGE_DELEGATES } from "@/app/app.constants";
import { StoredNetwork } from "@/models/model";
import { NetworkProvider } from "@/services/network/network";
import { StorageProvider } from "@/services/storage/storage";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataService } from "@/services/user-data/user-data.interface";

import ArkClient from "../../utils/ark-client";
import { ArkApiProvider } from "./ark-api";

fdescribe("ARK API", () => {
	let arkApiSpectator: SpectatorHttp<ArkApiProvider>;
	let arkApiService: ArkApiProvider;

	const currentNetwork = new StoredNetwork();
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
					}
				},
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

	it("should return network fee statistics", (done) => {
		const userDataService = arkApiSpectator.get(UserDataService);
		userDataService.onActivateNetwork$.next(currentNetwork);
		currentNetwork.isV2 = true;

		arkApiService.feeStatistics.subscribe({
			complete: () => done(),
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

		const req = arkApiSpectator.expectOne(
			"http://127.0.0.1:4003/api/v2/node/fees?days=7",
			HttpMethod.GET,
		);

		req.flush([]);
	});
});
