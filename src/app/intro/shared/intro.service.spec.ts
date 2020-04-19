import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { of } from "rxjs";

import { StorageProvider } from "@/services/storage/storage";

import { IntroService } from "./intro.service";

describe("Intro Service", () => {
	let spectator: SpectatorService<IntroService>;
	let service: IntroService;

	const createService = createServiceFactory({
		service: IntroService,
		mocks: [StorageProvider],
	});

	beforeEach(() => {
		spectator = createService();
		service = spectator.service;
	});

	it("should load intro", (done) => {
		const storageProvider = spectator.get(StorageProvider);
		storageProvider.get.and.returnValue(of("true"));
		service.load().subscribe((data) => {
			expect(data).toBe("true");
			done();
		});
	});
});
