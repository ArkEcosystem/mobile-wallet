import { IonicModule } from "@ionic/angular";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { SharedModule } from "@/app/shared.module";
import { DirectivesModule } from "@/directives/directives.module";

import { InputCurrencyComponent } from "./input-currency.component";

storiesOf("input-currency", module)
	.addDecorator(
		moduleMetadata({
			declarations: [InputCurrencyComponent],
			imports: [IonicModule, SharedModule, DirectivesModule],
		}),
	)
	.add("Default", () => ({
		component: InputCurrencyComponent,
		template: "<input-currency></input-currency>",
	}))
	.add("Relaxed", () => ({
		component: InputCurrencyComponent,
		template: `<input-currency isRelaxed="true"></input-currency>`,
	}));
