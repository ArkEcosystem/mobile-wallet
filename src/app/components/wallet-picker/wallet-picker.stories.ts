import { IonicModule } from "@ionic/angular";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { SharedModule } from "@/app/shared.module";
import { Contact } from "@/models/model";
import { PipesModule } from "@/pipes/pipes.module";

import { WalletPickerComponent } from "./wallet-picker.component";

export const walletsData: Contact[] = [
	{
		name: "ARK Team",
		address: "AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX",
	},
	{
		name: "Binance",
		address: "AdS7WvzqusoP759qRo6HDmUz2L34u4fMHz",
	},
];

storiesOf("wallet-picker", module)
	.addDecorator(
		moduleMetadata({
			declarations: [WalletPickerComponent],
			imports: [IonicModule, SharedModule, PipesModule],
		}),
	)
	.add("Default", () => ({
		props: {
			wallets: walletsData,
		},
		component: WalletPickerComponent,
		template: `<div class="p-5"><wallet-picker title="Wallets" [wallets]="wallets"></wallet-picker></div>`,
	}));
