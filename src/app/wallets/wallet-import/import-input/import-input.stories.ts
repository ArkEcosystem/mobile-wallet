import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { SharedModule } from "@/app/shared/shared.module";
import { DirectivesModule } from "@/directives/directives.module";
import { TruncateMiddlePipe } from "@/pipes/truncate-middle/truncate-middle";

import { ImportInputComponent } from "./import-input.component";

storiesOf("import-input", module)
	.addDecorator(
		moduleMetadata({
			declarations: [ImportInputComponent],
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
		component: ImportInputComponent,
		template: `
			<div class="p-5">
				<div class="mb-5" [formGroup]="form">
					<import-input formControlName="address"></import-input>
				</div>
				<div>
					<import-input [(ngModel)]="address"></import-input>
				</div>
			</div>
		`,
	}));
