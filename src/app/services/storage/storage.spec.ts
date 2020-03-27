import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";
import { switchMapTo } from "rxjs/operators";

import { StorageProvider } from "./storage";

let storageProvider: StorageProvider;
const OBJECT_TO_BE_STORED = { context: "I am been stored" };
const NONOBJECT_TO_BE_STORED = 123456;
const TEST_STORAGE_KEY = "TEST_STORAGE_KEY";
const TEST_NONOBJECT_STORAGE_KEY = "TEST_NONOBJECT_STORAGE_KEY";

describe("Storage service", () => {
	beforeEach(() => {
		const storage = new Storage({
			name: "__mydb",
			driverOrder: ["indexeddb", "sqlite", "websql"],
		});

		storageProvider = new StorageProvider(storage);
	});

	it("should set a object value in a key", () => {
		storageProvider.set(TEST_STORAGE_KEY, OBJECT_TO_BE_STORED);

		const result = storageProvider.get(TEST_STORAGE_KEY);
		expect(result).toBeInstanceOf(Observable);
	});

	it("should set a non object value in a key", () => {
		storageProvider.set(TEST_NONOBJECT_STORAGE_KEY, NONOBJECT_TO_BE_STORED);

		const result = storageProvider.get(TEST_NONOBJECT_STORAGE_KEY);
		expect(result).toBeInstanceOf(Observable);
	});

	it("should retrieve the stored value from a key", (done) => {
		storageProvider.getObject(TEST_STORAGE_KEY).subscribe((storedValue) => {
			expect(storedValue).toEqual(OBJECT_TO_BE_STORED);
			done();
		});
	});

	it("should clear the storage", (done) => {
		storageProvider
			.clear()
			.pipe(switchMapTo(storageProvider.getObject("TEST_STORAGE_KEY")))
			.subscribe((storedValue) => {
				expect(storedValue).toEqual({});
				done();
			});
	});

	it("should emit notification when storage is cleaned", (done) => {
		storageProvider.onClear$.subscribe(() => {
			expect().nothing();
			done();
		});
		storageProvider.clear().subscribe();
	});
});
