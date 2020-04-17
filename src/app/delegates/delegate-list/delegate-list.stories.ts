import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { IdenticonComponentModule } from "@/components/identicon/identicon.module";

import { DelegateListComponent } from "./delegate-list.component";

storiesOf("delegate-list", module)
	.addDecorator(
		moduleMetadata({
			declarations: [DelegateListComponent],
			imports: [TranslateModule, IonicModule, IdenticonComponentModule],
		}),
	)
	.add("Default", () => ({
		component: DelegateListComponent,
		props: {
			delegates: [
				{ username: "genesis_1", rank: 1 },
				{ username: "genesis_2", rank: 2 },
			],
		},
		template: `
			<ion-app>
				<ion-content>
					<delegate-list [delegates]="delegates"></delegate-list>
				</ion-content>
			</ion-app>
		`,
	}));
