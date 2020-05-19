import { TranslateModule } from "@ngx-translate/core";
import { withKnobs } from "@storybook/addon-knobs";
import { moduleMetadata } from "@storybook/angular";

import { WordBoxComponentModule } from "@/components/word-box/word-box.component.module";
import { PipesModule } from "@/pipes/pipes.module";

import { PasswordComponent } from "./password.component";

export default {
	title: "Modules / Password",
	decorators: [
		withKnobs,
		moduleMetadata({
			declarations: [PasswordComponent],
			imports: [TranslateModule, PipesModule, WordBoxComponentModule],
		}),
	],
};

export const Password = () => ({
	component: PasswordComponent,
	props: {
		words: ["blame", "fire", "duck"],
	},
	template: `
			<ion-app>
				<ion-content>
					<password-page [words]="words"></password-page>
				</ion-content>
			</ion-app>
		`,
});

Password.story = {
	name: "word-box",
};
