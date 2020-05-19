import { IonicModule } from "@ionic/angular";
import { number, text, withKnobs } from "@storybook/addon-knobs";
import { moduleMetadata } from "@storybook/angular";

import { WordBoxComponent } from "./word-box.component";

export default {
	title: "Components / Word Box",
	decorators: [
		withKnobs,
		moduleMetadata({
			declarations: [WordBoxComponent],
			imports: [IonicModule],
		}),
	],
};

export const WordBox = () => ({
	component: WordBoxComponent,
	props: {
		order: number("Order", 1),
		word: text("Word", "blame"),
	},
	template: `
			<ion-app>
				<ion-content class="ion-padding w-full flex justify-center items-center">
					<word-box [order]="order" [word]="word"></word-box>
				</ion-content>
			</ion-app>
		`,
});

WordBox.story = {
	name: "word-box",
};
