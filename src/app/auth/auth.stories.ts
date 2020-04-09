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
	template: `<ion-button (click)="register()">Register</ion-button>`,
})
export class TestAuthComponent {
	constructor(private authController: AuthController) {}

	register() {
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
		template: `<ion-app><auth-pin class="ion-page"></auth-pin></ion-app>`,
	}))
	.add("Touch Id", () => ({
		template: `<ion-app><auth-touch-id class="ion-page"></auth-touch-id></ion-app>`,
	}))
	.add("Locked", () => ({
		template: `<ion-app><auth-locked class="ion-page" [remainingSeconds]="30"></auth-locked></ion-app>`,
	}))
	.add("Auth", () => ({
		template: `<ion-app><auth class="ion-page"></auth></ion-app>`,
	}))
	.add("Modal", () => ({
		template: `<test-auth></test-auth>`,
	}));
