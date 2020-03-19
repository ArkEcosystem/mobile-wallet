import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { InputCurrencyComponent } from "@/components/input-currency/input-currency.component";
import { DirectivesModule } from "@/directives/directives.module";
import { PipesModule } from "@/pipes/pipes.module";

import { InputFeeComponent } from "./input-fee.component";

storiesOf("input-fee", module)
	.addDecorator(
		moduleMetadata({
			declarations: [InputFeeComponent, InputCurrencyComponent],
			imports: [
				IonicModule,
				CommonModule,
				FormsModule,
				ReactiveFormsModule,
				DirectivesModule,
				PipesModule,
			],
		}),
	)
	.add("Default", () => ({
		component: InputFeeComponent,
		template: `<div class="p-5"><input-fee></input-fee></div>`,
	}))
	.add("Range", () => ({
		component: InputFeeComponent,
		template: `<div class="p-5"><input-fee min="10" max="100"></input-fee></div>`,
	}));
