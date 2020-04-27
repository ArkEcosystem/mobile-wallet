import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { action } from "@storybook/addon-actions";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { NetworkCardComponentModule } from "../network-card/network-card.component.module";
import { NetworkListComponent } from "./network-list.component";

storiesOf("network-list", module)
	.addDecorator(
		moduleMetadata({
			declarations: [NetworkListComponent],
			imports: [TranslateModule, IonicModule, NetworkCardComponentModule],
		}),
	)
	.add("Default", () => ({
		component: NetworkListComponent,
		props: {
			handleAddNetwork: action("Add network"),
			networks: [
				{
					name: "ARK Ecosystem",
					type: "mainet",
				},
			],
		},
		template: `
			<ion-app>
				<ion-content>
					<network-list [networks]="networks" (addNetworkHandler)="handleAddNetwork()"></network-list>
				</ion-content>
			</ion-app>
		`,
	}));
