import { IonicStorageModule } from "@ionic/storage";
import { createServiceFactory, SpectatorService } from "@ngneat/spectator";

import { sleep } from "@@/test/helpers";

import { AsyncStorageService } from "./async-storage.service";

const data = [
	{ key: "test", value: "1" },
	{ key: "test2", value: "2" },
];

describe("Storage service", () => {
	let spectator: SpectatorService<AsyncStorageService>;
	let service: AsyncStorageService;

	const createService = createServiceFactory({
		service: AsyncStorageService,
		imports: [IonicStorageModule.forRoot()],
	});

	beforeEach(() => {
		spectator = createService();
		service = spectator.service;
	});

	it("should set and get a value in a key", async () => {
		service.setItem(data[0].key, data[0].value);
		service.setItem(data[1].key, data[1].value);
		await sleep(100);
		const output = await service.getItem(data[0].key).toPromise();
		expect(output).toEqual(data[0].value);
	});

	it("should get length", async () => {
		const output = await service.length().toPromise();
		expect(output).toBe(2);
	});

	it("should get keys", async () => {
		const output = await service.keys().toPromise();
		expect(output).toEqual(data.map((item) => item.key));
	});

	it("should remove item", async () => {
		service.removeItem(data[1].key);
		await sleep(20);
		const output = await service.getItem(data[1].key).toPromise();
		expect(output).toBeNull();
	});

	it("should clear", async () => {
		service.clear();
		await sleep(20);
		const length = await service.length().toPromise();
		expect(length).toBe(0);
	});
});
