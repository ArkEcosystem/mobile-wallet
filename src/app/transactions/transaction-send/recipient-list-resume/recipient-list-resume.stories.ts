import { IonicModule } from "@ionic/angular";
import { moduleMetadata } from "@storybook/angular";

import { IdenticonComponentModule } from "@/components/identicon/identicon.module";

import { RecipientListResumeComponent } from "./recipient-list-resume.component";

export default {
	title: "Components / Recipient List Resume",
	decorators: [
		moduleMetadata({
			declarations: [RecipientListResumeComponent],
			imports: [IdenticonComponentModule, IonicModule],
		}),
	],
};

export const RecipientListResume = () => ({
	component: RecipientListResumeComponent,
	props: {
		recipients: [
			{
				address: "AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9",
				amount: "212391242139",
			},
		],
	},
	template: `
			<ion-app>
				<ion-content class="ion-padding">
					<recipient-list-resume [recipients]="recipients"></recipient-list-resume>
				</ion-content>
			</ion-app>
		`,
});

export const RecipientListResumeLarge = () => ({
	component: RecipientListResumeComponent,
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
			{
				address: "AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX",
				amount: "192409974739",
			},
			{
				address: "AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX",
				amount: "192409974739",
			},
			{
				address: "AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX",
				amount: "192409974739",
			},
			{
				address: "AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX",
				amount: "192409974739",
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
					<recipient-list-resume [recipients]="recipients"></recipient-list-resume>
				</ion-content>
			</ion-app>
		`,
});

RecipientListResume.story = {
	name: "recipient-list-resume",
};

RecipientListResumeLarge.story = {
	name: "recipient-list-resume several recipients",
};
