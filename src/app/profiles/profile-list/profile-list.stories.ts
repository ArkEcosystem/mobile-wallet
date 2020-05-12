import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { ProfileListComponent } from "./profile-list.component";

storiesOf("profile-list", module)
	.addDecorator(
		moduleMetadata({
			declarations: [ProfileListComponent],
			imports: [TranslateModule, IonicModule],
		}),
	)
	.add("Default", () => ({
		component: ProfileListComponent,
		props: {
			profiles: [
				{ name: "Test", wallets: [] },
				{ name: "Test 2", wallets: [] },
			],
		},
		template: `
			<ion-app>
				<ion-content>
					<profile-list [profiles]="profiles"></profile-list>
				</ion-content>
			</ion-app>
		`,
	}));
