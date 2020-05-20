import {
	byTestId,
	createHostComponentFactory,
	SpectatorHost,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";

import { PipesModule } from "@/pipes/pipes.module";

import { WalletPassphraseListComponent } from "./wallet-passphrase-list.component";

fdescribe("Wallet Passphrase List", () => {
	let spectator: SpectatorHost<WalletPassphraseListComponent>;
	const createHost = createHostComponentFactory({
		component: WalletPassphraseListComponent,
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
			`<wallet-passphrase-list [words]="words"></wallet-passphrase-list>`,
			{
				hostProps: {
					words,
				},
			},
		);
		const component = spectator.query(byTestId("wallet-passphrase-list"));
		expect(component).toBeTruthy();
	});
});
