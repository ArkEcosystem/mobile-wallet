import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { BottomDrawerComponentModule } from "@/components/bottom-drawer/bottom-drawer.module";

import { DelegatesListComponentModule } from "../delegate-list/delegates-list.module";
import { DelegateService } from "../shared/delegate.service";
import { DelegateServiceMock } from "../shared/delegate.service.mock";
import { DelegateSearchComponent } from "./delegate-search.component";

storiesOf("delegate-search", module)
	.addDecorator(
		moduleMetadata({
			declarations: [DelegateSearchComponent],
			imports: [
				TranslateModule,
				IonicModule,
				BottomDrawerComponentModule,
				DelegatesListComponentModule,
			],
			providers: [
				{ provide: DelegateService, useClass: DelegateServiceMock },
			],
		}),
	)
	.add("Default", () => ({
		component: DelegateSearchComponent,
		template: `
			<ion-app>
				<ion-content>
					<delegate-search></delegate-search>
				</ion-content>
			</ion-app>
		`,
	}));
