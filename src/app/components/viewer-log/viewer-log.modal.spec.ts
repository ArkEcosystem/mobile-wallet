import { Clipboard } from "@ionic-native/clipboard/ngx";
import { IonicModule, ModalController } from "@ionic/angular";
import {
	byTestId,
	createHostFactory,
	createSpyObject,
	mockProvider,
	SpectatorHost,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { removeLogs, sleep } from "@@/test/helpers";
import { LoggerService } from "@/services/logger/logger.service";
import { ToastProvider } from "@/services/toast/toast";

import { ViewerLogComponent } from "./viewer-log.component";
import { ViewerLogModal } from "./viewer-log.modal";

describe("Viewer Modal Component", () => {
	let spectator: SpectatorHost<ViewerLogModal>;
	const clipboardProvider = {
		provide: Clipboard,
		useValue: createSpyObject(Clipboard),
	};
	const createHost = createHostFactory({
		component: ViewerLogModal,
		declarations: [ViewerLogComponent],
		imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
		mocks: [ModalController, ToastProvider],
		componentProviders: [clipboardProvider],
		providers: [
			clipboardProvider,
			mockProvider(LoggerService, {
				logs: [
					{
						time: 1585241630529,
						level: 45,
						msg: "Error",
					},
				],
			}),
		],
	});

	beforeAll(() => removeLogs());

	it("should show logs from logger service", async () => {
		spectator = createHost(
			`<ion-app><viewer-log-modal></viewer-log-modal></ion-app>`,
		);
		await sleep(100);
		const firstLog = spectator.query(byTestId("c-viewer-log__item__text"));
		expect(firstLog).toHaveText("Error");
	});

	it("should export to json", async () => {
		spectator = createHost(
			`<ion-app><viewer-log-modal></viewer-log-modal></ion-app>`,
		);
		await sleep(100);
		const exportButton = spectator.query(
			byTestId("m-viewer-log__buttons__export"),
		);
		await sleep(100);
		const clipboard = spectator.get(Clipboard);
		clipboard.copy.and.resolveTo();
		spectator.click(exportButton);

		expect(clipboard.copy).toHaveBeenCalledWith(jasmine.any(String));
	});

	it("should dismiss", async () => {
		spectator = createHost(
			`<ion-app><viewer-log-modal></viewer-log-modal></ion-app>`,
		);
		await sleep(100);
		const dismissButton = spectator.query(
			byTestId("m-viewer-log__buttons__close"),
		);
		await sleep(100);
		const modalCtrl = spectator.get(ModalController);
		modalCtrl.dismiss.and.resolveTo();
		spectator.click(dismissButton);
		expect(modalCtrl.dismiss).toHaveBeenCalled();
	});
});
