import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { Alert } from "./alert.component";

storiesOf("alert", module)
	.addDecorator(
		moduleMetadata({
			declarations: [Alert],
			imports: [IonicModule, CommonModule],
		}),
	)
	.add("Success", () => ({
		component: alert,
		template: `<alert-component [status]="status" [title]="title" [message]="message"></alert-component>`,
		props: {
			status: "success",
			title: "This is an success alert",
			message: "You can render positive messages here",
		},
	}))
	.add("Warning", () => ({
		component: alert,
		template: `<alert-component [status]="status" [title]="title" [message]="message"></alert-component>`,
		props: {
			status: "warning",
			title: "This is an warning alert",
			message: "You can render the warning description here",
		},
	}))
	.add("Error", () => ({
		component: alert,
		template: `<alert-component [status]="status" [title]="title" [message]="message"></alert-component>`,
		props: {
			status: "error",
			title: "This is an error alert",
			message: "You can render the error description here",
		},
	}));
