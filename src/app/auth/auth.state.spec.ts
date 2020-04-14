import { TestBed } from "@angular/core/testing";
import { NgxsModule, Store } from "@ngxs/store";
import { of } from "rxjs";

import { AuthActions } from "./auth.actions";
import { AuthService } from "./auth.service";
import { AUTH_STATE_TOKEN, AuthState } from "./auth.state";
import { AuthMethod, AuthMode } from "./auth.types";

describe("Auth State", () => {
	const authServiceSpy = {
		getPasswordHash: () => of(undefined),
		hasUnlockDateExpired: () => true,
		getNextUnlockDate: () => undefined,
		validatePassword: jasmine.createSpy(),
		hashPassword: jasmine.createSpy(),
	};
	let store: Store;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [NgxsModule.forRoot([AuthState])],
			providers: [
				{
					provide: AuthService,
					useValue: authServiceSpy,
				},
			],
		});

		store = TestBed.get(Store);
	});

	it("should create", () => {
		const state = store.selectSnapshot(AUTH_STATE_TOKEN);
		const hasMasterPassword = store.selectSnapshot(
			AuthState.hasMasterPassword,
		);
		expect(state).toEqual({
			attempts: 0,
			method: AuthMethod.Pin,
			unlockDate: undefined,
		});
		expect(hasMasterPassword).toBeFalse();
	});

	it("should assing values on 'open'", () => {
		store.dispatch(
			new AuthActions.Open({
				mode: AuthMode.Registration,
				method: AuthMethod.TouchID,
			}),
		);
		const state = store.selectSnapshot(AUTH_STATE_TOKEN);
		const mode = store.selectSnapshot(AuthState.mode);
		expect(state).toEqual({
			attempts: 0,
			method: AuthMethod.TouchID,
			unlockDate: undefined,
			mode: AuthMode.Registration,
		});
		expect(mode).toBe(AuthMode.Registration);
	});

	it("should clean on 'cancel'", () => {
		store.dispatch(new AuthActions.Cancel());
		const state = store.selectSnapshot(AUTH_STATE_TOKEN);
		expect(state).toEqual({
			attempts: 0,
			method: AuthMethod.Pin,
			unlockDate: undefined,
			mode: undefined,
			registerPasswordHash: undefined,
		});
	});

	it("should increase attempts on 'fail'", () => {
		store.dispatch(new AuthActions.Fail());
		const state = store.selectSnapshot(AUTH_STATE_TOKEN);
		expect(state).toEqual({
			attempts: 1,
			method: AuthMethod.Pin,
			unlockDate: undefined,
		});
	});

	it("should set method", () => {
		store.dispatch(new AuthActions.SetMethod(AuthMethod.TouchID));
		const state = store.selectSnapshot(AUTH_STATE_TOKEN);
		expect(state).toEqual({
			attempts: 0,
			method: AuthMethod.TouchID,
			unlockDate: undefined,
		});
	});

	it("should set password", async () => {
		authServiceSpy.hashPassword.and.returnValue("abc");
		store.dispatch(new AuthActions.Success("123456"));
		const state = store.selectSnapshot(AUTH_STATE_TOKEN);
		expect(state.registerPasswordHash).toBe("abc");
		expect(state.passwordHash).toBeUndefined();
	});

	it("should throw and increase attempts if validation failed", async () => {
		const password = "123456";
		authServiceSpy.hashPassword.and.returnValue("abc");
		store.dispatch(new AuthActions.Open({ mode: AuthMode.Registration }));
		await store.dispatch(new AuthActions.Success(password)).toPromise();
		store.dispatch(new AuthActions.Open({ mode: AuthMode.Confirmation }));
		authServiceSpy.validatePassword.and.returnValue(of(false));
		expectAsync(
			store
				.dispatch(new AuthActions.ValidatePassword(password))
				.toPromise(),
		).toBeRejected();
		const state = store.selectSnapshot(AUTH_STATE_TOKEN);
		expect(state.attempts).toBe(1);
	});

	it("should save hash if validation passes", async () => {
		authServiceSpy.validatePassword.and.returnValue(of(true));
		authServiceSpy.hashPassword.and.returnValue("abc");
		await store
			.dispatch(new AuthActions.ValidatePassword("132"))
			.toPromise();
		const state = store.selectSnapshot(AUTH_STATE_TOKEN);
		expect(state.attempts).toBe(0);
		expect(state.registerPasswordHash).toEqual("abc");
	});

	it("should not assign password if is authorization", async () => {
		store.dispatch(new AuthActions.Open({ mode: AuthMode.Authorization }));
		store.dispatch(new AuthActions.SetPassword("123"));
		const state = store.selectSnapshot(AUTH_STATE_TOKEN);
		expect(state.registerPasswordHash).toBeUndefined();
		expect(state.passwordHash).toBeUndefined();
	});

	it("should assign master password if is confirmation", async () => {
		store.dispatch(new AuthActions.Open({ mode: AuthMode.Confirmation }));
		authServiceSpy.hashPassword.and.returnValue("abc");
		store.dispatch(new AuthActions.SetPassword("123"));
		const state = store.selectSnapshot(AUTH_STATE_TOKEN);
		expect(state.registerPasswordHash).toBeUndefined();
		expect(state.passwordHash).toEqual("abc");
	});
});
