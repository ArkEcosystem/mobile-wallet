import { FormGroupDirective, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { SharedModule } from "@/app/shared.module";
import { DirectivesModule } from "@/directives/directives.module";
import { TruncateMiddlePipe } from "@/pipes/truncate-middle/truncate-middle";

import { InputAddressComponent } from "./input-address.component";

storiesOf("input-address", module)
	.addDecorator(
		moduleMetadata({
			declarations: [InputAddressComponent],
			imports: [
				IonicModule,
				SharedModule,
				DirectivesModule,
				ReactiveFormsModule,
			],
			providers: [FormGroupDirective, TruncateMiddlePipe],
		}),
	)
	.add("Default", () => ({
		component: InputAddressComponent,
		template: `
			<div class="p-5">
				<input-address></input-address>
				<div class="mt-5">
					<input-address address="AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX"></input-address>
				</div>
			</div>
		`,
	}));
