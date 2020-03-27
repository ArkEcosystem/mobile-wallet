import { TestBed } from "@angular/core/testing";
import { IonicStorageModule } from "@ionic/storage";
import { switchMapTo } from "rxjs/operators";

import { UserDataProviderMock } from "@@/test/mocks";
import { Profile, StoredNetwork } from "@/models/model";
import { NetworkProvider } from "@/services/network/network";
import { UserDataService } from "@/services/user-data/user-data.interface";

import { ContactsProvider } from "./contacts";

const VALID_ADDRESS = "D8x2Rno1CxrE5kRoVHS1EooQnfTL3v5ZyM";
const VALID_ADDRESS_2 = "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8";
const INVALID_ADDRESS = "D8x2Rno1CxrE5kRoVHS1EooQnfTL3v5z12";

describe("Contacts service", () => {
	let contactsService: ContactsProvider;
	let userDataService: UserDataService;
	let userProfile: Profile;

	beforeEach(function () {
		TestBed.configureTestingModule({
			imports: [IonicStorageModule.forRoot()],
			providers: [
				ContactsProvider,
				NetworkProvider,
				{ provide: UserDataService, useClass: UserDataProviderMock },
			],
		});
		contactsService = TestBed.inject(ContactsProvider);
		userDataService = TestBed.inject(UserDataService);
		// Mock network
		const network = new StoredNetwork();
		network.version = 30;
		userDataService.currentNetwork = network;
		contactsService.removeContactByAddress(VALID_ADDRESS);
		contactsService.removeContactByAddress(VALID_ADDRESS_2);
	});

	describe("Add contact", () => {
		it("should add a contact", (done) => {
			contactsService.addContact(VALID_ADDRESS, "Caio").subscribe(() => {
				const contact = contactsService.getContactByName("Caio");
				expect(contact).toEqual({
					address: VALID_ADDRESS,
					name: "Caio",
				});
				done();
			});
		});

		it("should throw invalid address error", (done) => {
			contactsService.addContact(INVALID_ADDRESS, "b").subscribe(
				() => {},
				(error) => {
					expect(error.key).toEqual("CONTACTS_PAGE.INVALID_ADDRESS");
					done();
				},
			);
		});

		it("should throw invalid name empty error", (done) => {
			contactsService.addContact(VALID_ADDRESS, null).subscribe(
				() => {},
				(error) => {
					expect(error.key).toEqual(
						"CONTACTS_PAGE.CONTACT_NAME_EMPTY",
					);
					done();
				},
			);
		});

		it("should throw existent address error", (done) => {
			contactsService
				.addContact(VALID_ADDRESS, "Caio")
				.pipe(
					switchMapTo(
						contactsService.addContact(VALID_ADDRESS, "Caio"),
					),
				)
				.subscribe(
					(data) => {},
					(error) => {
						expect(error.key).toEqual(
							"CONTACTS_PAGE.CONTACT_EXISTS_ADDRESS",
						);
						done();
					},
				);
		});

		it("should throw existent name error", (done) => {
			contactsService
				.addContact(VALID_ADDRESS, "Caio")
				.pipe(
					switchMapTo(
						contactsService.addContact(VALID_ADDRESS_2, "Caio"),
					),
				)
				.subscribe(
					(data) => {},
					(error) => {
						expect(error.key).toEqual(
							"CONTACTS_PAGE.CONTACT_EXISTS_NAME",
						);
						done();
					},
				);
		});
	});

	describe("Edit contact", () => {
		it("should edit a contact name", (done) => {
			contactsService.addContact(VALID_ADDRESS, "Caio");
			contactsService
				.editContact(VALID_ADDRESS, "Katy")
				.subscribe((data) => {
					const contact = contactsService.getContactByAddress(
						VALID_ADDRESS,
					);
					expect(contact).toEqual({
						address: VALID_ADDRESS,
						name: "Katy",
					});
					done();
				});
		});

		it("should throw inexistent address error", (done) => {
			contactsService.addContact(VALID_ADDRESS, "Lilo").subscribe(() => {
				contactsService.editContact(VALID_ADDRESS_2, "Stich").subscribe(
					() => {},
					(error) => {
						expect(error.key).toEqual(
							"CONTACTS_PAGE.CONTACT_NOT_EXISTS_ADDRESS",
						);
						done();
					},
				);
			});
		});

		it("should throw existent name error", (done) => {
			contactsService.addContact(VALID_ADDRESS, "Lilo").subscribe(() => {
				contactsService.editContact(VALID_ADDRESS_2, "Lilo").subscribe(
					() => {},
					(error) => {
						expect(error.key).toEqual(
							"CONTACTS_PAGE.CONTACT_EXISTS_NAME",
						);
					},
				);
				done();
			});
		});

		it("should throw empty contact name error", (done) => {
			contactsService.addContact(VALID_ADDRESS, "Lilo").subscribe(() => {
				contactsService.editContact(VALID_ADDRESS, null).subscribe(
					() => {},
					(error) => {
						expect(error.key).toEqual(
							"CONTACTS_PAGE.CONTACT_NAME_EMPTY",
						);
					},
				);
				done();
			});
		});

		it("should throw empty contact address error", (done) => {
			contactsService.addContact(VALID_ADDRESS, "Lilo").subscribe(() => {
				contactsService.editContact(null, "Lilo").subscribe(
					() => {},
					(error) => {
						expect(error.key).toEqual(
							"CONTACTS_PAGE.CONTACT_ADDRESS_EMPTY",
						);
					},
				);
				done();
			});
		});
	});

	describe("By address", () => {
		it("should remove a contact by address", (done) => {
			contactsService.addContact(VALID_ADDRESS, "Lilo").subscribe(() => {
				contactsService
					.removeContactByAddress(VALID_ADDRESS)
					.subscribe(() => {
						const contact = contactsService.getContactByName(
							"Lilo",
						);
						expect(contact).toEqual(undefined);
					});
				done();
			});
		});

		it("should get a contact by address", (done) => {
			contactsService.addContact(VALID_ADDRESS, "Lilo").subscribe(() => {
				const contact = contactsService.getContactByAddress(
					VALID_ADDRESS,
				);
				expect(contact).toEqual({
					address: VALID_ADDRESS,
					name: "Lilo",
				});
				done();
			});
		});

		it("should return null if no address provided", (done) => {
			contactsService.addContact(VALID_ADDRESS, "Lilo").subscribe(() => {
				const contact = contactsService.getContactByAddress(null);
				expect(contact).toEqual(null);
				done();
			});
		});
	});

	describe("By name", () => {
		it("should get a contact by name", (done) => {
			contactsService.addContact(VALID_ADDRESS, "Lilo").subscribe(() => {
				const contact = contactsService.getContactByName("Lilo");
				expect(contact).toEqual({
					address: VALID_ADDRESS,
					name: "Lilo",
				});
				done();
			});
		});

		it("should return null if no name provided", (done) => {
			contactsService.addContact(VALID_ADDRESS, "Lilo").subscribe(() => {
				const contact = contactsService.getContactByName(null);
				expect(contact).toEqual(null);
				done();
			});
		});
	});
});
