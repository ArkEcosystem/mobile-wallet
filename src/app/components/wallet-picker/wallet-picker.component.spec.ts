import { IonicModule } from "@ionic/angular";
import { createHostComponentFactory, SpectatorHost } from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { removeLogs } from "@@/test/helpers";

import { WalletPickerComponent } from "./wallet-picker.component";

describe("Wallet Picker Component", () => {
	let spectator: SpectatorHost<WalletPickerComponent>;
	const createHost = createHostComponentFactory({
		component: WalletPickerComponent,
		imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
	});

	beforeAll(() => removeLogs());

	it("should create", () => {
		spectator = createHost("<wallet-picker></wallet-picker>");
		expect(spectator.component).toBeTruthy();
	});
});
