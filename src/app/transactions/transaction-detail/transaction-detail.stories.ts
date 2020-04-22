import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { InputFeeComponentModule } from "@/components/input-fee/input-fee.module";

import { TransactionDetailComponent } from "./transaction-detail.component";

storiesOf("transaction-detail", module)
	.addDecorator(
		moduleMetadata({
			declarations: [TransactionDetailComponent],
			imports: [TranslateModule, IonicModule, InputFeeComponentModule],
		}),
	)
	.add("Default", () => ({
		component: TransactionDetailComponent,
		template: `
			<ion-app>
				<ion-content>
					<transaction-detail></transaction-detail>
				</ion-content>
			</ion-app>
		`,
	}));
