import {
	byTestId,
	createHostComponentFactory,
	SpectatorHost,
} from "@ngneat/spectator";

import { PipesModule } from "@/pipes/pipes.module";

import { WalletCardComponent } from "./wallet-card.component";

describe("Wallet Card", () => {
	let spectator: SpectatorHost<WalletCardComponent>;
	const createHost = createHostComponentFactory({
		component: WalletCardComponent,
		imports: [PipesModule],
	});

	it("should create", () => {
		spectator = createHost(
			`<wallet-card [name]="name" [balance]="balance" [currency]="currency" [address]="address"></wallet-card>`,
			{
				hostProps: {
					address: "AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9",
					name: "ARK Ecosystem",
					balance: "20000",
					currency: "ARK",
				},
			},
		);
		const component = spectator.query(byTestId("c-wallet-card"));
		expect(component).toBeTruthy();
	});
});
