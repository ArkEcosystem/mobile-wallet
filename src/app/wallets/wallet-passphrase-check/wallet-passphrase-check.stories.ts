import { TranslateModule } from "@ngx-translate/core";
import { withKnobs } from "@storybook/addon-knobs";
import { moduleMetadata } from "@storybook/angular";

import { PipesModule } from "@/pipes/pipes.module";

import { WalletPassphraseCheckComponent } from "./wallet-passphrase-check.component";

export default {
	title: "Components / Wallet Passphrase Check",
	decorators: [
		withKnobs,
		moduleMetadata({
			declarations: [WalletPassphraseCheckComponent],
			imports: [TranslateModule, PipesModule],
		}),
	],
};

export const WalletPassphraseCheck = () => ({
	component: WalletPassphraseCheckComponent,
	props: {
		words: [
			"blame",
			"fire",
			"duck",
			"spoon",
			"word",
			"dog",
			"cat",
			"potato",
			"tomato",
			"bread",
			"forest",
			"tree",
		],
	},
	template: `
			<div class="p-4">
				<wallet-passphrase-check [words]="words"></wallet-passphrase-check>
			</div>
		`,
});

WalletPassphraseCheck.story = {
	name: "wallet-passphrase-check",
};
