import { TestBed } from "@angular/core/testing";

import { NetworkProvider } from "@/services/network/network";
import { UserDataService } from "@/services/user-data/user-data.interface";

import { ContactsProvider } from "./contacts";

const VALID_ADDRESS = "D8x2Rno1CxrE5kRoVHS1EooQnfTL3v5ZyM";
const INVALID_ADDRESS = "D8x2Rno1CxrE5kRoVHS1EooQnfTL3v5z12";

fdescribe("Contacts service", () => {
	let contactsService: ContactsProvider;

	beforeEach(function() {
		TestBed.configureTestingModule({
			// imports: [IonicStorageModule.forRoot()],
			providers: [ContactsProvider, NetworkProvider, UserDataService],
		});

		contactsService = TestBed.inject(ContactsProvider);
	});

	it("should throw invalid address error", done => {
		contactsService.addContact("a", "b").subscribe(
			() => {},
			error => {
				expect(error.key).toEqual("CONTACTS_PAGE.INVALID_ADDRESS");
				done();
			},
		);
	});

	// it("should edit a contact", () => {
	//     expect().toBe();
	// });

	// it("should remove a contact by address", () => {
	//     expect().toBe();
	// });

	// it("should get a contact by address", () => {
	//     expect().toBe();
	// });

	// it("should get a contact by name", () => {
	//     expect().toBe();
	// });

	// it("should get the profile" () => {
	//     expect().toBe();
	// });
});
