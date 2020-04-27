import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { NetworkListComponentModule } from "./network-list/network-list.component.module";
import { NetworksComponent } from "./networks.component";

storiesOf("networks", module)
	.addDecorator(
		moduleMetadata({
			declarations: [NetworksComponent],
			imports: [TranslateModule, IonicModule, NetworkListComponentModule],
		}),
	)
	.add("Default", () => ({
		component: NetworksComponent,
		template: `
			<ion-app>
				<ion-content>
					<networks></networks>
				</ion-content>
			</ion-app>
		`,
	}));
