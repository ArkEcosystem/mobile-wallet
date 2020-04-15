import { TranslateModule } from "@ngx-translate/core";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { DelegateUnvoteBannerComponent } from "./delegate-unvote-banner/delegate-unvote-banner.component";

storiesOf("delegate", module)
	.addDecorator(
		moduleMetadata({
			declarations: [DelegateUnvoteBannerComponent],
			imports: [TranslateModule],
		}),
	)
	.add("Unvote Banner", () => ({
		component: DelegateUnvoteBannerComponent,
		template: `<div class="p-4"><delegate-unvote-banner username="genesis_1"></delegate-unvote-banner></div>`,
	}));
