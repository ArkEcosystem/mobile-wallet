import { IonicModule } from "@ionic/angular";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { SharedModule } from "@/app/shared/shared.module";
import { PipesModule } from "@/pipes/pipes.module";

import { BottomDrawerComponent } from "./bottom-drawer.component";

storiesOf("bottom-drawer", module)
	.addDecorator(
		moduleMetadata({
			declarations: [BottomDrawerComponent],
			imports: [IonicModule, SharedModule, PipesModule],
		}),
	)
	.add("Default", () => ({
		component: BottomDrawerComponent,
		props: {
			isOpen: true,
		},
		template: `
			<div>
				<ion-button (click)="isOpen = !isOpen">{{ isOpen ? "Hide" : "Show" }}</ion-button>
				<bottom-drawer
					[isOpen]="isOpen"
					[middleOffset]="500"
					[backdrop]="false"
					(buttonDrawerOnClose)="isOpen = false"
				>
					<h1>Test</h1>
				</bottom-drawer>
			</div>
		`,
	}));
