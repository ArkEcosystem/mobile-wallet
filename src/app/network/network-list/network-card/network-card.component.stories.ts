import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { NetworkCardComponent } from "./network-card.component";

storiesOf("network-card", module)
	.addDecorator(
		moduleMetadata({
			declarations: [NetworkCardComponent],
			imports: [TranslateModule, IonicModule],
		}),
	)
	.add("Default ", () => ({
		component: NetworkCardComponent,
		props: {
			name: "ARK Ecosystem",
			type: "Mainet",
		},
		template: `
			<ion-app>
				<ion-content class="ion-padding w-full flex justify-center items-center">
					<network-card [name]="name" [type]="type"></network-card>
				</ion-content>
			</ion-app>
		`,
	}));
