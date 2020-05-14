import { APP_BASE_HREF } from "@angular/common";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { ProfileListComponent } from "./profile-list.component";

storiesOf("profile-list", module)
	.addDecorator(
		moduleMetadata({
			declarations: [ProfileListComponent],
			imports: [
				TranslateModule,
				IonicModule,
				RouterModule.forRoot([], { useHash: true }),
			],
			providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
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
				<div class="p-4">
					<profile-list [profiles]="profiles"></profile-list>
				</div>
			</ion-app>
		`,
	}));
