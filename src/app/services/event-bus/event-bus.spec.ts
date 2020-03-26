import { createServiceFactory, SpectatorService } from "@ngneat/spectator";

import { EventBusProvider } from "./event-bus";

describe("Event Bus Service", () => {
	let spectator: SpectatorService<EventBusProvider>;
	const createService = createServiceFactory({
		service: EventBusProvider,
	});

	beforeEach(() => (spectator = createService()));

	it("should emit", async (done) => {
		const key = "test";
		const data = "value";

		spectator.service.$subject.subscribe((result) => {
			expect(result).toEqual(
				jasmine.objectContaining({
					key,
					data,
				}),
			);
			done();
		});
		spectator.service.emit(key, data);
	});
});
