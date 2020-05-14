import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import {
	byTestId,
	createComponentFactory,
	mockProvider,
	Spectator,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";
import { NgxsModule } from "@ngxs/store";
import { EMPTY, of } from "rxjs";

import { removeLogs, sleep } from "@@/test/helpers";

import { AuthController } from "../auth/shared/auth.controller";
import { AuthService } from "../auth/shared/auth.service";
import { AuthState } from "../auth/shared/auth.state";
import { ProfileState } from "../profiles/shared/profile.state";
import { SignupComponent } from "./signup.component";

describe("Signup", () => {
	let spectator: Spectator<SignupComponent>;
	const createComponent = createComponentFactory({
		component: SignupComponent,
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			NgxsModule.forRoot([ProfileState, AuthState]),
			RouterModule.forRoot([]),
		],
		mocks: [AuthController],
		providers: [
			mockProvider(AuthService, {
				getPasswordHash: () => of(undefined),
			}),
		],
	});

	beforeAll(() => removeLogs());

	beforeEach(() => (spectator = createComponent()));

	it("should create", () => {
		expect(spectator.component).toBeTruthy();
	});

	it("should contain the signin link", async () => {
		await sleep(100);
		const signinButton = spectator.query(byTestId("signup__signin"));
		spectator.click(signinButton);
		expect(signinButton).toBeVisible();
	});

	it("should be disabled if the name is empty", async () => {
		await sleep(100);
		const nextBtn = spectator.query(byTestId("signup__next"));
		const button = nextBtn.shadowRoot.querySelector("button");
		expect(button).toBeDisabled();
	});

	it("should call the auth register if no password is registered", async () => {
		const authCtrl = spectator.get(AuthController);
		authCtrl.register.and.returnValue(EMPTY);
		await sleep(100);
		const input = spectator.query(byTestId("signup__form__name"));
		spectator.typeInElement("test", input);
		const nextBtn = spectator.query(byTestId("signup__next"));
		spectator.click(nextBtn);
		expect(authCtrl.register).toHaveBeenCalled();
	});
});
