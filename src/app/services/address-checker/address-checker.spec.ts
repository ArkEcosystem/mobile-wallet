import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { IonicStorageModule } from "@ionic/storage";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

import { ArkApiProvider } from "@/services/ark-api/ark-api";
import { NeoApiProvider } from "@/services/neo-api/neo-api";
import { NetworkProvider } from "@/services/network/network";
import { StorageProvider } from "@/services/storage/storage";
import { UserDataService } from "@/services/user-data/user-data.interface";

import { AddressCheckerProvider } from "./address-checker";

const INVALID_ADDRESS = "D8x2Rno1CxrE5kRoVHS1EooQnfTL3v5z12";

fdescribe("Address checker module", () => {
	let addressCheckerProvider: AddressCheckerProvider;
	let arkApiProvider: ArkApiProvider;
	let networkProvider: NetworkProvider;
	let userDataService: UserDataService;
	let neoApiProvider: NeoApiProvider;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				TranslateModule.forRoot(),
				IonicStorageModule.forRoot(),
				HttpClientTestingModule,
			],
			providers: [
				AddressCheckerProvider,
				ArkApiProvider,
				UserDataService,
				NetworkProvider,
				NeoApiProvider,
				StorageProvider,
				TranslateService,
			],
		});

		addressCheckerProvider = TestBed.inject(AddressCheckerProvider);
		networkProvider = TestBed.inject(NetworkProvider);
		userDataService = TestBed.inject(UserDataService);
		arkApiProvider = TestBed.inject(ArkApiProvider);
		neoApiProvider = TestBed.inject(NeoApiProvider);
	});

	describe("Check address", () => {
		it("should trow invalid address error", done => {
			addressCheckerProvider.checkAddress(INVALID_ADDRESS).subscribe(
				() => {},
				error => {
					console.log({ error });
					done();
				},
			);
		});
	});
});
