import { Component } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { IonicStorageModule } from "@ionic/storage";
import { TranslateModule } from "@ngx-translate/core";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { BottomDrawerComponentModule } from "@/components/bottom-drawer/bottom-drawer.module";
import { StorageProvider } from "@/services/storage/storage";

import { AuthComponent } from "./auth.component";
import { AuthController } from "./auth.controller";
import { AuthComponentModule } from "./auth.module";

@Component({
	selector: "test-auth",
	template: `<ion-button (click)="open()">Test</ion-button>`,
})
export class TestAuthComponent {
	constructor(private authController: AuthController) {}

	open() {
		this.authController.register().subscribe({
			next: () => console.log(1),
			error: () => console.log(2),
			complete: () => console.log(3),
		});
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
			entryComponents: [AuthComponent],
			providers: [StorageProvider, AuthController],
		}),
	)
	.add("Pin", () => ({
		template: `<div>
			<auth-pin></auth-pin>
		</div>`,
	}))
	.add("Modal", () => ({
		template: `<div>
			<test-auth></test-auth>
		</div>`,
	}))
	.add("Locked", () => ({
		template: `<auth-locked [remainingSeconds]="100"></auth-locked>`,
	}));
