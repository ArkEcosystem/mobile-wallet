import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { Alert } from "./alert.component";

storiesOf("alert-types", module)
	.addDecorator(
		moduleMetadata({
			declarations: [Alert],
			imports: [IonicModule, CommonModule],
		}),
	)
	.add("success", () => ({
		component: alert,
		template: `<alert-component [type]="type" [title]="title" [message]="message"></alert-component>`,
		props: {
			type: "success",
			title: "This is an success alert",
			message: "You can render positive messages here",
		},
	}))
	.add("warning", () => ({
		component: alert,
		template: `<alert-component [type]="type" [title]="title" [message]="message"></alert-component>`,
		props: {
			type: "warning",
			title: "This is an warning alert",
			message: "You can render the warning description here",
		},
	}))
	.add("error", () => ({
		component: alert,
		template: `<alert-component [type]="type" [title]="title" [message]="message"></alert-component>`,
		props: {
			type: "error",
			title: "This is an error alert",
			message: "You can render the error description here",
		},
	}));
