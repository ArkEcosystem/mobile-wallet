import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
// import { action } from "@storybook/addon-actions";
import { moduleMetadata } from "@storybook/angular";

import { IdenticonComponentModule } from "@/components/identicon/identicon.module";
import { PipesModule } from "@/pipes/pipes.module";

import { RecipientListComponent } from "./recipient-list.component";

export default {
	title: "Components / Recipient List",
	decorators: [
		moduleMetadata({
			declarations: [RecipientListComponent],
			imports: [
				TranslateModule,
				IonicModule,
				PipesModule,
				IdenticonComponentModule,
			],
		}),
	],
};

export const RecipientList = () => ({
	component: RecipientListComponent,
	props: {
		recipients: [
			{
				address: "AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9",
				amount: "212391242139",
			},
			{
				address: "AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX",
				amount: "192409974739",
			},
		],
	},
	template: `
			<ion-app>
				<ion-content class="ion-padding">
					<recipient-list [recipients]="recipients"></recipient-list>
				</ion-content>
			</ion-app>
		`,
});

RecipientList.story = {
	name: "recipient-list",
};
