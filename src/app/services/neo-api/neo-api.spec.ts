import { HTTP } from "@ionic-native/http/ngx";
import {
	createHttpFactory,
	HttpMethod,
	mockProvider,
	SpectatorHttp,
} from "@ngneat/spectator";

// Fixtures
import transactions from "@@/test/fixture/transactions.fixture";
import { NetworkProvider } from "@/services/network/network";
import { UserDataService } from "@/services/user-data/user-data.interface";

import { NeoApiProvider } from "./neo-api";

const INVALID_ADDRESS = "AXaXZjZGA3qhQRTCsyG5uFKr9HeShgVhTF";
const VALID_ADDRESS = "ALyvfuUN5yqbNaJ3f3Z6uX1Tkehg7AJ4FM";
const REQUEST_URL =
	"https://neoscan.io/api/main_net/v1/get_last_transactions_by_address/ALyvfuUN5yqbNaJ3f3Z6uX1Tkehg7AJ4FM";

describe("Neo API Service", () => {
	let neoApiSpectator: SpectatorHttp<NeoApiProvider>;
	let neoApiService: NeoApiProvider;

	const createNeoApiMock = createHttpFactory({
		service: NeoApiProvider,
		mocks: [NetworkProvider],
		providers: [mockProvider(UserDataService, {}), mockProvider(HTTP)],
	});

	beforeEach(() => {
		neoApiSpectator = createNeoApiMock();
		neoApiService = neoApiSpectator.service;
	});

	it("should test if the address doesn't exists", (done) => {
		const networkProvider = neoApiSpectator.get(NetworkProvider);
		networkProvider.isValidAddress.and.returnValue(false);

		neoApiService.doesAddressExist(INVALID_ADDRESS).subscribe((data) => {
			expect(data).toEqual(false);
			done();
		});
	});

	it("should test if the address does exists", (done) => {
		const networkProvider = neoApiSpectator.get(NetworkProvider);
		networkProvider.isValidAddress.and.returnValue(true);

		neoApiService.doesAddressExist(VALID_ADDRESS).subscribe((result) => {
			expect(result).toBeTrue();
			done();
		});
		const req = neoApiSpectator.expectOne(REQUEST_URL, HttpMethod.GET);
		req.flush(transactions);
	});
});
