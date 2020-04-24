import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { action } from "@storybook/addon-actions";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { NetworkCardComponentModule } from "./network-card/network-card.component.module";
import { NetworkListComponent } from "./network-list.component";

storiesOf("network-list", module)
	.addDecorator(
		moduleMetadata({
			declarations: [NetworkListComponent],
			imports: [TranslateModule, IonicModule, NetworkCardComponentModule],
		}),
	)
	.add("Empty network list", () => ({
		component: NetworkListComponent,
		props: {
			addNetworkClick: action("Add network"),
			networks: [],
		},
		template: `
			<ion-app>
				<ion-content>
					<network-list [networks]="networks" (addNetworkClick)="addNetworkClick()"></network-list>
				</ion-content>
			</ion-app>
		`,
	}))
	.add("Network list", () => ({
		component: NetworkListComponent,
		props: {
			addNetworkClick: action("Add network"),
			networks: [
				{
					name: "ARK Ecosystem",
					type: "mainnet",
				},
			],
		},
		template: `
			<ion-app>
				<ion-content>
					<network-list [networks]="networks" (addNetworkClick)="addNetworkClick()"></network-list>
				</ion-content>
			</ion-app>
		`,
	}));
