import { IonicModule } from "@ionic/angular";
import { byTestId, createHostFactory, SpectatorHost } from "@ngneat/spectator";

import { removeLogs, sleep } from "@@/test/helpers";

import { ViewerLogComponent } from "./viewer-log.component";

describe("Viewer Log Component", () => {
	let spectator: SpectatorHost<ViewerLogComponent>;
	const createHost = createHostFactory({
		component: ViewerLogComponent,
		imports: [IonicModule.forRoot()],
	});

	beforeAll(() => removeLogs());

	it("should show logs", async () => {
		spectator = createHost(
			`<ion-app><ion-content fullscreen class="ion-padding"><viewer-log [logs]="logs"></viewer-log></ion-content></ion-app>`,
			{
				hostProps: {
					logs: [
						{
							time: 1585241630529,
							level: 45,
							msg: "Error",
						},
						{
							time: 1585241630536,
							level: 50,
							msg: "Fail",
						},
					],
				},
			},
		);
		await sleep(100);
		const firstLog = spectator.query(byTestId("c-viewer-log__item__text"));
		expect(firstLog).toHaveText("Error");
	});
});
