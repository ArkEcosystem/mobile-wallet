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
			address: "",
			form: new FormGroup({
				address: new FormControl("AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9", [
					Validators.required,
				]),
			}),
		},
		component: InputAddressComponent,
		template: `
			<div class="p-5">
				<div class="mb-5" [formGroup]="form">
					<input-address formControlName="address"></input-address>
				</div>
				<div>
					<input-address [(ngModel)]="address"></input-address>
				</div>
			</div>
		`,
	}));
