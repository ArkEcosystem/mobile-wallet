import {
	createHttpFactory,
	mockProvider,
	SpectatorService,
} from "@ngneat/spectator";
import { TranslateService } from "@ngx-translate/core";
import { of } from "rxjs";

import delegatesFixture from "@@/test/fixture/delegates.fixture";
import { STORAGE_DELEGATES } from "@/app/app.constants";
import { StoredNetwork } from "@/models/model";
import { NetworkProvider } from "@/services/network/network";
import { StorageProvider } from "@/services/storage/storage";
import { ToastProvider } from "@/services/toast/toast";
import { UserDataService } from "@/services/user-data/user-data.interface";

import { ArkApiProvider } from "./ark-api";

fdescribe("ARK API", () => {
	let arkApiSpectator: SpectatorService<ArkApiProvider>;
	let arkApiService: ArkApiProvider;

	const currentNetwork = new StoredNetwork();

	currentNetwork.version = 30;
	currentNetwork.name = "devnet";

	const createArkApiMock = createHttpFactory({
		service: ArkApiProvider,
		mocks: [NetworkProvider, ToastProvider, TranslateService],
		providers: [
			mockProvider(UserDataService, {
				currentNetwork,
				onActivateNetwork$: of({ currentNetwork }),
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

	it("should get the current network", (done) => {
		console.log({ network: arkApiService.network });
		done();
	});
});
