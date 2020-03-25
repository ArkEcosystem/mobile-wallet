import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
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
				FormsModule,
				ReactiveFormsModule,
			],
			providers: [TruncateMiddlePipe],
		}),
	)
	.add("Default", () => ({
		props: {
			name: "abcdasddasdasdasdasdasdasdasdas",
			form: new FormGroup({
				address: new FormControl("abcdasddasdasdasdasdasdasdasdas", [
					Validators.required,
				]),
			}),
		},
		component: InputAddressComponent,
		template: `
			<div class="p-5" >
				<div class="mt-5" [formGroup]="form">
					<input-address formControlName="address"></input-address>
					{{ form.get("address").value }}
				</div>
				<div>
					<input-address [(ngModel)]="name"></input-address>
					{{ name }}
				</div>
			</div>
		`,
	}));
