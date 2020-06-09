import {
	byTestId,
	createHostComponentFactory,
	SpectatorHost,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { PipesModule } from "@/pipes/pipes.module";

import { WalletPassphraseCheckComponent } from "./wallet-passphrase-check.component";

describe("Wallet Passphrase Check", () => {
	let spectator: SpectatorHost<WalletPassphraseCheckComponent>;
	const createHost = createHostComponentFactory({
		component: WalletPassphraseCheckComponent,
		imports: [TranslateModule.forRoot(), PipesModule],
	});

	const words = [
		"blame",
		"fire",
		"duck",
		"blame",
		"fire",
		"duck",
		"blame",
		"fire",
		"duck",
		"blame",
		"fire",
		"duck",
	];

	it("should create", () => {
		spectator = createHost(
			`<wallet-passphrase-check [words]="words"></wallet-passphrase-check>`,
			{
				hostProps: {
					words,
				},
			},
		);
		const component = spectator.query(byTestId("wallet-passphrase-check"));
		expect(component).toBeTruthy();
	});
});
