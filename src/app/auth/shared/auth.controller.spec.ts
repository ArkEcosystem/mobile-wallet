import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import {
	byTestId,
	createHostComponentFactory,
	mockProvider,
	SpectatorHost,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";
import { NgxsModule, Store } from "@ngxs/store";
import { of } from "rxjs";

import { removeLogs, sleep } from "@@/test/helpers";
import { UserDataService } from "@/services/user-data/user-data.interface";

import { AuthPinComponent } from "../auth-pin/auth-pin.component";
import { AuthComponent } from "../auth.component";
import { AuthActions } from "./auth.actions";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthState } from "./auth.state";
import { AuthMode } from "./auth.types";

@Component({
	selector: "test-auth",
	template: `<div>
		<ion-button data-testid="c-test-auth__request" (click)="request()">
			Request
		</ion-button>
		<ion-button data-testid="c-test-auth__register" (click)="register()"
			>Register</ion-button
		>
		<ion-button data-testid="c-test-auth__update" (click)="update()"
			>Update</ion-button
		>
	</div>`,
})
export class TestAuthControllerComponent {
	public requestCompleted = undefined;
	public requestResult = undefined;

	public registerCompleted = undefined;
	public registerResult = undefined;

	constructor(private authController: AuthController) {}

	request() {
		this.requestCompleted = undefined;
		this.requestResult = undefined;
		this.authController.request().subscribe({
			next: (r) => (this.requestResult = r),
			complete: () => (this.requestCompleted = true),
		});
	}

	register() {
		this.registerCompleted = undefined;
		this.registerResult = undefined;
		this.authController.register().subscribe({
			next: (r) => (this.registerResult = r),
			complete: () => (this.registerCompleted = true),
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

describe("Auth Controller", () => {
	let spectator: SpectatorHost<TestAuthControllerComponent>;
	let component: TestAuthControllerComponent;
	let store: Store;
	const createComponent = createHostComponentFactory({
		component: TestAuthControllerComponent,
		declarations: [AuthComponent, AuthPinComponent],
		imports: [
			IonicModule.forRoot(),
			CommonModule,
			TranslateModule.forRoot(),
			NgxsModule.forRoot([AuthState]),
		],
		providers: [
			AuthController,
			mockProvider(UserDataService),
			mockProvider(AuthService, {
				getPasswordHash: () => of(undefined),
				hasUnlockDateExpired: () => true,
				getNextUnlockDate: () => undefined,
			}),
		],
	});

	beforeAll(() => removeLogs());

	beforeEach(() => {
		spectator = createComponent(`<test-auth></test-auth>`);
		component = spectator.component;
		store = spectator.get(Store);
	});

	it("should create", () => {
		expect(spectator.component).toBeTruthy();
	});

	describe("Request", () => {
		beforeEach(() => {
			const requestBtn = spectator.query(
				byTestId("c-test-auth__request"),
			);
			spectator.click(requestBtn);
		});

		it("should open the modal in authorization mode", async () => {
			await sleep(100);
			const modalEle = spectator.query(".c-auth-modal", {
				root: true,
			});
			const mode = store.selectSnapshot(AuthState.mode);
			expect(mode).toEqual(AuthMode.Authorization);
			expect(modalEle).toBeVisible();
			// @ts-ignore
			await modalEle.dismiss();
			expect(component.requestCompleted).toEqual(true);
		});

		it("should complete after the successful event", async () => {
			await sleep(200);
			store.dispatch(new AuthActions.Success("123"));
			await sleep(100);
			expect(component.requestResult).toEqual(
				jasmine.objectContaining({ password: "123" }),
			);
		});
	});

	describe("Register", () => {
		beforeEach(() => {
			const registerBtn = spectator.query(
				byTestId("c-test-auth__register"),
			);
			spectator.click(registerBtn);
		});

		it("should open the confirmation modal and cancel", async () => {
			await sleep(200);
			store.dispatch(new AuthActions.Success("123"));
			await sleep(700);

			const mode = store.selectSnapshot(AuthState.mode);
			expect(mode).toEqual(AuthMode.Confirmation);

			const modalEle = spectator.query(".c-auth-modal", {
				root: true,
			});
			// @ts-ignore
			await modalEle.dismiss();
			expect(component.registerResult).toBeUndefined();
			expect(component.registerCompleted).toEqual(true);
		});

		it("should open the confirmation modal and complete", async () => {
			await sleep(200);
			store.dispatch(new AuthActions.Success("123"));
			await sleep(700);

			const mode = store.selectSnapshot(AuthState.mode);
			expect(mode).toEqual(AuthMode.Confirmation);

			store.dispatch(new AuthActions.Success("123"));
			await sleep(50);
			expect(component.registerResult).toEqual(
				jasmine.objectContaining({
					password: "123",
				}),
			);
			expect(component.registerCompleted).toEqual(true);
		});
	});
});
