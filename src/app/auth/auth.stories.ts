import { APP_BASE_HREF } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { IonicStorageModule } from "@ionic/storage";
import { TranslateModule } from "@ngx-translate/core";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { BottomDrawerComponentModule } from "@/components/bottom-drawer/bottom-drawer.module";
import { StorageProvider } from "@/services/storage/storage";

import { AuthComponent } from "./auth.component";
import { AuthController } from "./auth.controller";
import { AuthModule } from "./auth.module";

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
				RouterModule.forRoot([], { useHash: true }),
				IonicStorageModule.forRoot(),
				TranslateModule,
				BottomDrawerComponentModule,
				AuthModule,
			],
			entryComponents: [AuthComponent],
			providers: [
				StorageProvider,
				AuthController,
				{
					provide: APP_BASE_HREF,
					useValue: "/",
				},
			],
		}),
	)
	.add("Pin", () => ({
		template: `<auth-pin></auth-pin>`,
	}))
	.add("Touch Id", () => ({
		template: `<auth-touch-id></auth-touch-id>`,
	}))
	.add("Locked", () => ({
		template: `<auth-locked [remainingSeconds]="30"></auth-locked>`,
	}))
	.add("Auth", () => ({
		template: `<ion-app><auth class="ion-page"></auth></ion-app>`,
	}))
	.add("Modal", () => ({
		template: `<div>
			<test-auth></test-auth>
		</div>`,
	}));
