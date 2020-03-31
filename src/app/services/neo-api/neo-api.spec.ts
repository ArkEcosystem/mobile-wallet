import {
	createHttpFactory,
	createServiceFactory,
	HttpMethod,
	mockProvider,
	SpectatorHttp,
	SpectatorService,
} from "@ngneat/spectator";

import { NetworkProvider } from "@/services/network/network";
import { UserDataService } from "@/services/user-data/user-data.interface";

import { NeoApiProvider } from "./neo-api";

const INVALID_ADDRESS = "AXaXZjZGA3qhQRTCsyG5uFKr9HeShgVhTF";
const VALID_ADDRESS = "ALyvfuUN5yqbNaJ3f3Z6uX1Tkehg7AJ4FM";
const REQUEST_URL =
	"https://neoscan.io/api/main_net/v1/get_last_transactions_by_address/ALyvfuUN5yqbNaJ3f3Z6uX1Tkehg7AJ4FM";

fdescribe("Neo API Service", () => {
	let neoApiSpectator: SpectatorService<NeoApiProvider>;
	let neoApiService: NeoApiProvider;
	let httpSpectator: SpectatorHttp<NeoApiProvider>;

	const createNeoApiMock = createServiceFactory({
		service: NeoApiProvider,
		mocks: [NetworkProvider],
		providers: [mockProvider(UserDataService, {})],
	});

	const createHttp = createHttpFactory(NeoApiProvider);

	beforeEach(() => {
		neoApiSpectator = createNeoApiMock();
		neoApiService = neoApiSpectator.service;
		httpSpectator = createHttp();
	});

	it("should test if the address doesn't exists", (done) => {
		const networkProvider = neoApiSpectator.get(NetworkProvider);
		networkProvider.isValidAddress.and.returnValue(false);

		neoApiService.doesAddressExist(INVALID_ADDRESS).subscribe((data) => {
			expect(data).toEqual(false);
			done();
		});
	});

	it("should test if the address does exists", () => {
		const networkProvider = neoApiSpectator.get(NetworkProvider);
		networkProvider.isValidAddress.and.returnValue(true);

		neoApiService.doesAddressExist(VALID_ADDRESS).subscribe();
		httpSpectator.expectOne(REQUEST_URL, HttpMethod.GET);
	});
});
