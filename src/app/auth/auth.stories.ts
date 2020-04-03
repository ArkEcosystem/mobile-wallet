import { Component } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { IonicStorageModule } from "@ionic/storage";
import { TranslateModule } from "@ngx-translate/core";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { BottomDrawerComponentModule } from "@/components/bottom-drawer/bottom-drawer.module";
import { StorageProvider } from "@/services/storage/storage";

import { AuthController } from "./auth.controller";
import { AuthComponentModule } from "./auth.module";

@Component({
	selector: "test-auth",
	template: `<ion-button (click)="open()">Test</ion-button>`,
})
export class TestAuthComponent {
	constructor(private authController: AuthController) {}

	open() {
		this.authController.request().subscribe();
	}
}

storiesOf("auth", module)
	.addDecorator(
		moduleMetadata({
			declarations: [TestAuthComponent],
			imports: [
				IonicModule,
				IonicStorageModule.forRoot(),
				TranslateModule,
				BottomDrawerComponentModule,
				AuthComponentModule,
			],
			providers: [StorageProvider, AuthController],
		}),
	)
	.add("Pin", () => ({
		template: `<div>
			<test-auth></test-auth>
			<auth-pin></auth-pin>
		</div>`,
	}));
