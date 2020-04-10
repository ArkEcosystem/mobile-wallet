import { fakeAsync, tick } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";
import {
	byTestId,
	createHostComponentFactory,
	mockProvider,
	SpectatorHost,
	SpyObject,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";
import { Actions, NgxsModule, ofActionDispatched, Store } from "@ngxs/store";
import { of } from "rxjs";

import { removeLogs, sleep } from "@@/test/helpers";
import { PipesModule } from "@/pipes/pipes.module";

import { AuthActions } from "../auth.actions";
import { AuthService } from "../auth.service";
import { AuthState } from "../auth.state";
import { AuthMode } from "../auth.types";
import { AuthPinComponent } from "./auth-pin.component";

describe("Auth Pin Component", () => {
	let spectator: SpectatorHost<AuthPinComponent>;
	let component: AuthPinComponent;
	let store: Store;

	const createComponent = createHostComponentFactory({
		component: AuthPinComponent,
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			PipesModule,
			NgxsModule.forRoot([AuthState]),
		],
		providers: [
			mockProvider(AuthService, {
				getPasswordHash: () => of(undefined),
				hasUnlockDateExpired: () => true,
			}),
		],
	});

	const pressKeyboard = (keys: number[]) => {
		const keyboard = spectator.queryAll(
			byTestId("c-auth-pin__keyboard__char"),
		);
		keys.forEach((id) => spectator.click(keyboard[id]));
		return keyboard;
	};

	beforeAll(() => removeLogs());

	beforeEach(() => {
		spectator = createComponent("<auth-pin></auth-pin>");
		component = spectator.component;
		store = spectator.get(Store);
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should change the title according to the mode", fakeAsync(() => {
		const title = spectator.query(byTestId("c-auth-pin__title"));

		store.dispatch(new AuthActions.Open({ mode: AuthMode.Confirmation }));
		spectator.tick(50);
		expect(title).toHaveText("PIN_CODE.CONFIRM");

		store.dispatch(new AuthActions.Open({ mode: AuthMode.Registration }));
		spectator.tick(50);
		expect(title).toHaveText("PIN_CODE.CREATE");

		store.dispatch(new AuthActions.Open({ mode: AuthMode.Authorization }));
		spectator.tick(50);
		expect(title).toHaveText("PIN_CODE.DEFAULT_MESSAGE");
	}));

	it("should handle clicks on keyboard", fakeAsync(() => {
		const password = spectator.queryAll(
			byTestId("c-auth-pin__password__char"),
		);
		const keyboard = pressKeyboard([1]);
		tick(100);
		expect(password[0]).toHaveClass("c-auth-pin__password__char--active");

		const backspace = keyboard.pop();
		spectator.click(backspace);
		tick(100);
		expect(password[0]).not.toHaveClass(
			"c-auth-pin__password__char--active",
		);
	}));

	describe("Weak Confirmation", () => {
		let authService: SpyObject<AuthService>;

		beforeEach(() => {
			store.dispatch(
				new AuthActions.Open({ mode: AuthMode.Registration }),
			);
			authService = spectator.get(AuthService);
		});

		it("should clear the password if press 'no'", async () => {
			authService.isWeakPassword.and.returnValue(true);
			pressKeyboard([1, 1, 1, 1, 1, 1]);
			await sleep(100);
			const noButton = spectator.query(".c-auth-pin__weak-modal__no", {
				root: true,
			});

			spectator.click(noButton);
			expect(component.password).toHaveLength(0);
		});

		it("should dispatch success if press 'yes'", async (done) => {
			authService.isWeakPassword.and.returnValue(true);
			pressKeyboard([1, 1, 1, 1, 1, 1]);
			await sleep(300);
			const yesButton = spectator.query(".c-auth-pin__weak-modal__yes", {
				root: true,
			});

			const actions$ = spectator.inject(Actions);
			actions$
				.pipe(ofActionDispatched(AuthActions.Success))
				.subscribe(() => done());

			spectator.click(yesButton);
		});

		it("should dispatch success if not weak", async (done) => {
			authService.isWeakPassword.and.returnValue(false);
			pressKeyboard([1, 1, 1, 1, 1, 1]);

			const actions$ = spectator.inject(Actions);
			actions$
				.pipe(ofActionDispatched(AuthActions.Success))
				.subscribe(() => done());
		});
	});

	it("should clear password when wrong in authorization mode", async () => {
		const authService = spectator.get(AuthService);
		authService.validatePassword.and.returnValue(of(false));
		store.dispatch(new AuthActions.Open({ mode: AuthMode.Authorization }));
		pressKeyboard([1, 1, 1, 1, 1, 1]);
		await sleep(50);
		expect(component.password).toHaveLength(0);
	});
});
