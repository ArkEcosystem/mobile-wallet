import { RouterModule } from "@angular/router";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { IonicModule, NavController } from "@ionic/angular";
import {
	byTestId,
	byText,
	createTestComponentFactory,
	mockProvider,
	Spectator,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";
import { Actions, NgxsModule, ofActionDispatched } from "@ngxs/store";
import { of } from "rxjs";

import { sleep } from "@@/test/helpers";
import { AuthController } from "@/app/auth/shared/auth.controller";
import { UserDataService } from "@/services/user-data/user-data.interface";

import { SettingsPage } from "./settings.component";
import { SettingsActions } from "./shared/settings.actions";
import { SettingsConfig } from "./shared/settings.config";
import { SettingsService } from "./shared/settings.service";
import { SettingsState } from "./shared/settings.state";

describe("Settings Component", () => {
	let spectator: Spectator<SettingsPage>;
	let settingsPageComponent: SettingsPage;
	const createSettingsPage = createTestComponentFactory({
		component: SettingsPage,
		mocks: [AuthController, NavController],
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			NgxsModule.forRoot([SettingsState]),
			RouterModule.forRoot([]),
		],
		providers: [
			InAppBrowser,
			mockProvider(UserDataService),
			mockProvider(SettingsService, {
				clear: () => of({}),
			}),
		],
	});

	beforeEach(() => {
		spectator = createSettingsPage();
		settingsPageComponent = spectator.component;
		spyOn(window, "open").and.stub();
	});

	it("should dispatch update language", async (done) => {
		const actions$ = spectator.inject(Actions);
		actions$
			.pipe(ofActionDispatched(SettingsActions.Update))
			.subscribe(({ payload }) => {
				expect(payload).toEqual({ language: "pt-br" });
				done();
			});

		// Wait ionic rendering
		await sleep(500);
		const languageSelector = spectator.query(
			byTestId("settings__select-language"),
		);

		spectator.click(languageSelector);
		// Wait overlay animation and rendering
		await sleep(500);
		// Find and select the option
		const portugueseOption = spectator.queryLast(byText("Português"), {
			root: true,
		});

		spectator.click(portugueseOption);
		await sleep(500);
		const okButton = spectator.queryLast(byText("OK"), {
			root: true,
		});
		spectator.click(okButton);
	});

	it("should dispatch update currency", async (done) => {
		const actions$ = spectator.inject(Actions);
		actions$
			.pipe(ofActionDispatched(SettingsActions.Update))
			.subscribe(({ payload }) => {
				expect(payload).toEqual({ currency: "eur" });
				done();
			});

		// Wait ionic rendering
		await sleep(500);
		const currencySelector = spectator.query(
			byTestId("settings__select-currency"),
		);

		spectator.click(currencySelector);
		// Wait overlay animation and rendering
		await sleep(500);
		// Find and select the option
		const euroOption = spectator.queryLast(byText("EURO"), {
			root: true,
		});

		spectator.click(euroOption);
		await sleep(500);
		const okButton = spectator.queryLast(byText("OK"), {
			root: true,
		});
		spectator.click(okButton);
	});

	it("should dispatch update word list language", async (done) => {
		const actions$ = spectator.inject(Actions);
		actions$
			.pipe(ofActionDispatched(SettingsActions.Update))
			.subscribe(({ payload }) => {
				expect(payload).toEqual({ wordlistLanguage: "italian" });
				done();
			});

		// Wait ionic rendering
		await sleep(500);
		const wordlistLanguageSelector = spectator.query(
			byTestId("settings__select-wordlistLanguage"),
		);

		spectator.click(wordlistLanguageSelector);
		// Wait overlay animation and rendering
		await sleep(500);
		// Find and select the option
		const italianOption = spectator.queryLast(byText("Italian"), {
			root: true,
		});

		spectator.click(italianOption);
		await sleep(500);
		const okButton = spectator.queryLast(byText("OK"), {
			root: true,
		});
		spectator.click(okButton);
	});

	it("should dispatch update dark mode", async (done) => {
		const actions$ = spectator.inject(Actions);
		actions$
			.pipe(ofActionDispatched(SettingsActions.Update))
			.subscribe(({ payload }) => {
				expect(payload).toEqual({ darkMode: true });
				done();
			});
		// Wait ionic rendering
		await sleep(500);
		const darkModeToggle = spectator.query(
			byTestId("settings__item-darkMode"),
		);

		spectator.click(darkModeToggle);
	});

	it("should dispatch update dev mode", async (done) => {
		const actions$ = spectator.inject(Actions);
		actions$
			.pipe(ofActionDispatched(SettingsActions.Update))
			.subscribe(({ payload }) => {
				expect(payload).toEqual({ devMode: true });
				done();
			});
		// Wait ionic rendering
		await sleep(500);
		const version = spectator.query(byTestId("settings__item-version"));

		for (let i = 0; i <= 4; i++) {
			spectator.click(version);
		}
	});

	it("should dispatch clear action", async (done) => {
		const actions$ = spectator.inject(Actions);
		actions$
			.pipe(ofActionDispatched(SettingsActions.Clear))
			.subscribe(() => done());

		// Wait ionic rendering
		await sleep(500);
		const clearData = spectator.query(byTestId("settings__item-clearData"));
		spectator.click(clearData);

		await sleep(500);
		const confirmButton = spectator.queryLast(byText("CONFIRM"), {
			root: true,
		});

		spectator.click(confirmButton);
	});

	it("should open privacy policy", async () => {
		// Wait ionic rendering
		await sleep(500);
		const privacyPolicy = spectator.query(
			byTestId("settings__item-privacyPolicy"),
		);
		spectator.click(privacyPolicy);

		expect(window.open).toHaveBeenCalledWith(
			SettingsConfig.PRIVACY_POLICY_URL,
			"_system",
		);
	});

	it("should open the pin handler", async () => {
		// Wait ionic rendering
		await sleep(500);
		const pinChanger = spectator.query(
			byTestId("settings__item-changePin"),
		);
		spectator.click(pinChanger);
		await sleep(500);
		const authCtrl = spectator.get(AuthController);
		expect(authCtrl.update).toHaveBeenCalled();
	});

	it("should open the manage networks page", async () => {
		// Wait ionic rendering
		await sleep(500);
		const pinChanger = spectator.query(
			byTestId("settings__item-manageNetworks"),
		);
		spectator.click(pinChanger);
		await sleep(500);
		const navCtrl = spectator.get(NavController);
		expect(navCtrl.navigateForward).toHaveBeenCalled();
	});
});
