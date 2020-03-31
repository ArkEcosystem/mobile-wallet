import { HttpClient } from "@angular/common/http";
import {
	createHTTPFactory,
	createServiceFactory,
	SpectatorService,
} from "@ngneat/spectator";

import { NetworkProvider } from "@/services/network/network";

import { NeoApiProvider } from "./neo-api";

const INVALID_ADDRESS = "AXaXZjZGA3qhQRTCsyG5uFKr9HeShgVhTF";
const VALID_ADDRESS = "ALyvfuUN5yqbNaJ3f3Z6uX1Tkehg7AJ4FM";

fdescribe("Neo API Service", () => {
	let neoApiSpectator: SpectatorService<NeoApiProvider>;
	let neoApiService: NeoApiProvider;
	let http: HttpClient;

	const createNeoApiMock = createServiceFactory({
		service: NeoApiProvider,
		mocks: [NetworkProvider, HttpClient],
	});

	beforeEach(() => {
		neoApiSpectator = createNeoApiMock();
		neoApiService = neoApiSpectator.service;
		http = createHTTPFactory<NeoApiProvider>(NeoApiProvider);
	});

	it("should test if the address doesn't exists", (done) => {
		neoApiService.doesAddressExist(INVALID_ADDRESS).subscribe((data) => {
			expect(data).toEqual(false);
			done();
		});
	});

	it("should test if the address does exists", (done) => {
		const networkProvider = neoApiSpectator.get(NetworkProvider);
		networkProvider.isValidAddress.and.returnValue(true);

		neoApiService.doesAddressExist(VALID_ADDRESS).subscribe((data) => {
			expect(data).toEqual(false);
			done();
		});
	});

	// it("should test if is valid address", () => {});
});
