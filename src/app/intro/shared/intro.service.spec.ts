import { createServiceFactory, SpectatorService } from "@ngneat/spectator";
import { of } from "rxjs";

import { StorageProvider } from "@/services/storage/storage";

import { IntroService } from "./intro.service";
import { IntroStateModel } from "./intro.type";

describe("Intro Service", () => {
	let spectator: SpectatorService<IntroService>;
	let service: IntroService;
	const defaultState: IntroStateModel = {
		activeIndex: 0,
		isFinished: false,
	};
	const createService = createServiceFactory({
		service: IntroService,
		mocks: [StorageProvider],
	});

	beforeEach(() => {
		spectator = createService();
		service = spectator.service;
	});

	it("should load intro", (done) => {
		const storage = spectator.get(StorageProvider);
		storage.get.and.returnValue(of(defaultState));
		service.load().subscribe((data) => {
			expect(data).toEqual(defaultState);
			done();
		});
	});
});
