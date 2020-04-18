import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { IonicStorageModule } from "@ionic/storage";
import { TranslateModule } from "@ngx-translate/core";
import { moduleMetadata, storiesOf } from "@storybook/angular";

import { BottomDrawerComponentModule } from "@/components/bottom-drawer/bottom-drawer.module";
import { StorageProvider } from "@/services/storage/storage";
import { UserDataServiceImpl } from "@/services/user-data/user-data";
import { UserDataService } from "@/services/user-data/user-data.interface";

import { AuthComponent } from "./auth.component";
import { AuthModule } from "./auth.module";
import { AuthController } from "./shared/auth.controller";

@Component({
	selector: "test-auth",
	template: `<div>
		<ion-button (click)="register()">Register</ion-button>
		<ion-button (click)="update()">Update</ion-button>
	</div>`,
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

	update() {
		this.authController.update().subscribe({
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
				{ provide: UserDataService, useClass: UserDataServiceImpl },
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
