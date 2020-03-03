import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";
import { StorageProvider } from "./storage";

let storageProvider = null;
const TO_BE_STORED = { context: "I am been stored" };
const TEST_STORAGE_KEY = "TEST_STORAGE_KEY";

fdescribe("Storage service", () => {
	beforeEach(() => {
		const storage = new Storage({
			name: "__mydb",
			driverOrder: ["indexeddb", "sqlite", "websql"],
		});

		storageProvider = new StorageProvider(storage);
	});

	it("should set a value in a key", () => {
		storageProvider.set(TEST_STORAGE_KEY, TO_BE_STORED);

		const result = storageProvider.get(TEST_STORAGE_KEY);
		expect(result).toBeInstanceOf(Observable);
	});

	it("should retrieve the stored value from a key", done => {
		storageProvider.getObject(TEST_STORAGE_KEY).subscribe(storedValue => {
			expect(storedValue).toEqual(TO_BE_STORED);
			done();
		});
    });
    
    it('should clear the storage', done => {
        storageProvider.clear()
        storageProvider.getObject('TEST_STORAGE_KEY').subscribe(storedValue => {
            expect(storedValue).toEqual({})
            done();
        })
    })
});
