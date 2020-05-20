import { APP_BASE_HREF } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateModule } from "@ngx-translate/core";
import { withKnobs } from "@storybook/addon-knobs";
import { moduleMetadata } from "@storybook/angular";

import { PipesModule } from "@/pipes/pipes.module";

import { PasswordPageComponent } from "./password-page.component";
import { WordBoxComponentModule } from "./word-box/word-box.component.module";

export default {
	title: "Modules / Password",
	decorators: [
		withKnobs,
		moduleMetadata({
			declarations: [PasswordPageComponent],
			imports: [
				TranslateModule,
				PipesModule,
				WordBoxComponentModule,
				RouterTestingModule,
			],
			providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
		}),
	],
};

export const Password = () => ({
	component: PasswordPageComponent,
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
			<ion-app>
				<ion-content>
					<password-page [words]="words"></password-page>
				</ion-content>
			</ion-app>
		`,
});

Password.story = {
	name: "password-page",
};
