import {
	createServiceFactory,
	mockProvider,
	SpectatorService,
} from "@ngneat/spectator";
import { of } from "rxjs";

import { StorageProvider } from "@/services/storage/storage";

import { IntroService } from "./intro.service";
import { IntroStateModel } from "./intro.type";

describe("Intro Service", () => {
	let spectator: SpectatorService<IntroService>;
	let service: IntroService;
	const defaultState: IntroStateModel = {
		activeIndex: 0,
		paginationSize: 3,
		isFinished: false,
	};
	const createService = createServiceFactory({
		service: IntroService,
		providers: [
			mockProvider(StorageProvider, {
				get: () => of(defaultState),
			}),
		],
	});

	beforeEach(() => {
		spectator = createService();
		service = spectator.service;
	});

	it("should load intro", (done) => {
		service.load().subscribe((data) => {
			expect(data).toEqual(defaultState);
			done();
		});
	});
});
