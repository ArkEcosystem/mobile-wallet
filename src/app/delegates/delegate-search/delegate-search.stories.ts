import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { DelegateListComponentModule } from "../delegate-list/delegate-list.module";
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
				DelegateListComponentModule,
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
