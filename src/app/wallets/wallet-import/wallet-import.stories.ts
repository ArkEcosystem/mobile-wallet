import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { PipesModule } from "@/pipes/pipes.module";

import { ImportInputComponentModule } from "./import-input/import-input.module";
import { WalletImportComponent } from "./wallet-import.component";

storiesOf("import-wallet", module)
	.addDecorator(
		moduleMetadata({
			declarations: [WalletImportComponent],
			imports: [
				TranslateModule,
				IonicModule,
				PipesModule,
				ImportInputComponentModule,
				ReactiveFormsModule,
				FormsModule,
			],
		}),
	)
	.add("Default", () => ({
		component: WalletImportComponent,
		template: `
			<ion-app>
				<ion-content>
					<wallet-import-page>
					</wallet-import-page>
				</ion-content>
			</ion-app>
		`,
	}));
