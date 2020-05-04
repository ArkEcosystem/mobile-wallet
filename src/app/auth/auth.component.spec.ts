import { IonicModule } from "@ionic/angular";
import {
	byTestId,
	createComponentFactory,
	mockProvider,
	Spectator,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";
import { NgxsModule, Store } from "@ngxs/store";
import { of } from "rxjs";

import { removeLogs } from "@@/test/helpers";
import { PipesModule } from "@/pipes/pipes.module";

import { AuthLockedComponent } from "./auth-locked/auth-locked.component";
import { AuthPinComponent } from "./auth-pin/auth-pin.component";
import { AuthComponent } from "./auth.component";
import { AuthActions } from "./shared/auth.actions";
import { AuthService } from "./shared/auth.service";
import { AuthState } from "./shared/auth.state";

describe("Auth Component", () => {
	let spectator: Spectator<AuthComponent>;
	let store: Store;
	const createComponent = createComponentFactory({
		declarations: [AuthPinComponent, AuthLockedComponent],
		component: AuthComponent,
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
				getNextUnlockDate: () => undefined,
			}),
		],
	});

	beforeAll(() => removeLogs());

	beforeEach(() => {
		spectator = createComponent();
		store = spectator.get(Store);
	});

	it("should create", () => {
		expect(spectator.component).toBeTruthy();
	});

	it("should show the pin component", () => {
		const pinComponent = spectator.query(byTestId("c-auth__pin"));
		expect(pinComponent).toBeVisible();
	});

	it("should lock if has unlock date", () => {
		const authService = spectator.get(AuthService);
		authService.getUnlockRemainingSeconds.and.returnValue(2);
		authService.getUnlockCountdown.and.returnValue(of(2));
		store.dispatch(new AuthActions.Fail());
		spectator.detectChanges();
		const lockedComponent = spectator.query(byTestId("c-auth__locked"));
		const pinComponent = spectator.query(byTestId("c-auth__pin"));
		expect(lockedComponent).toBeVisible();
	});
});
