import { IonicModule } from "@ionic/angular";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { SharedModule } from "@/app/shared.module";

import { ViewerLogComponentModule } from "./viewer-log.component.module";
import { ViewerLogModal } from "./viewer-log.modal";

storiesOf("viewer-log", module)
	.addDecorator(
		moduleMetadata({
			declarations: [ViewerLogModal],
			imports: [IonicModule, SharedModule, ViewerLogComponentModule],
		}),
	)
	.add("Default", () => ({
		props: {
			logs: [
				{
					time: 1585241630529,
					level: 45,
					msg: "Error",
				},
				{
					time: 1585241630536,
					level: 50,
					msg: "Fail",
				},
			],
		},
		component: ViewerLogModal,
		template: `
			<ion-app>
				<viewer-log-modal [logs]="logs"></viewer-log-modal>
			</ion-app>
		`,
	}));
