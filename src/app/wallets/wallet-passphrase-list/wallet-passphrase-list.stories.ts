import { TranslateModule } from "@ngx-translate/core";
import { withKnobs } from "@storybook/addon-knobs";
import { moduleMetadata } from "@storybook/angular";

import { PipesModule } from "@/pipes/pipes.module";

import { WalletPassphraseListComponent } from "./wallet-passphrase-list.component";

export default {
	title: "Components / Wallet Passphrase List",
	decorators: [
		withKnobs,
		moduleMetadata({
			declarations: [WalletPassphraseListComponent],
			imports: [TranslateModule, PipesModule],
		}),
	],
};

export const WalletPassphraseList = () => ({
	component: WalletPassphraseListComponent,
	props: {
		words: [
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
		],
	},
	template: `
		<div class="p-4">
			<wallet-passphrase-list [words]="words"></wallet-passphrase-list>
		</div>
		`,
});

WalletPassphraseList.story = {
	name: "wallet-passphrase-list",
};
