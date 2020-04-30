import { RouterModule } from "@angular/router";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { IonicModule } from "@ionic/angular";
import {
	createServiceFactory,
	mockProvider,
	SpectatorService,
} from "@ngneat/spectator";
import { TranslateModule } from "@ngx-translate/core";
import { Actions, NgxsModule, ofActionDispatched } from "@ngxs/store";
import { of } from "rxjs";

import { AuthController } from "@/app/auth/shared/auth.controller";
import { UserDataService } from "@/services/user-data/user-data.interface";

import { SettingsPage } from "./settings.component";
import { SettingsActions } from "./shared/settings.actions";
import { SettingsConfig } from "./shared/settings.config";
import { SettingsService } from "./shared/settings.service";
import { SettingsState } from "./shared/settings.state";

describe("Settings Component", () => {
	let spectator: SpectatorService<SettingsPage>;
	let settingsPage: SettingsPage;
	const createSettingsPage = createServiceFactory({
		service: SettingsPage,
		imports: [
			IonicModule.forRoot(),
			TranslateModule.forRoot(),
			NgxsModule.forRoot([SettingsState]),
			RouterModule.forRoot([]),
		],
		providers: [
			AuthController,
			InAppBrowser,
			mockProvider(UserDataService),
			mockProvider(SettingsService, {
				clear: () => of({}),
			}),
		],
	});

	beforeEach(() => {
		spectator = createSettingsPage();
		settingsPage = spectator.service;
		spyOn(window, "open").and.stub();
	});

	it("should dispatch update language", (done) => {
		const actions$ = spectator.inject(Actions);
		actions$
			.pipe(ofActionDispatched(SettingsActions.Update))
			.subscribe(({ payload }) => {
				expect(payload).toEqual({ language: "pt-br" });
				done();
			});

		const event = {
			detail: {
				value: "pt-br",
			},
		};

		settingsPage.updateLanguage(event);
	});

	it("should dispatch update currency", (done) => {
		const actions$ = spectator.inject(Actions);
		actions$
			.pipe(ofActionDispatched(SettingsActions.Update))
			.subscribe(({ payload }) => {
				expect(payload).toEqual({ currency: "euro" });
				done();
			});

		const event = {
			detail: {
				value: "euro",
			},
		};

		settingsPage.updateCurrency(event);
	});

	it("should dispatch update word list language", (done) => {
		const actions$ = spectator.inject(Actions);
		actions$
			.pipe(ofActionDispatched(SettingsActions.Update))
			.subscribe(({ payload }) => {
				expect(payload).toEqual({ wordlistLanguage: "portuguese" });
				done();
			});

		const event = {
			detail: {
				value: "portuguese",
			},
		};

		settingsPage.updateWordlistLanguage(event);
	});

	it("should dispatch update dark mode", (done) => {
		const actions$ = spectator.inject(Actions);
		actions$
			.pipe(ofActionDispatched(SettingsActions.Update))
			.subscribe(({ payload }) => {
				expect(payload).toEqual({ darkMode: true });
				done();
			});

		const event = {
			detail: {
				checked: true,
			},
		};

		settingsPage.updateDarkMode(event);
	});

	it("should dispatch update dev mode", (done) => {
		const actions$ = spectator.inject(Actions);
		actions$
			.pipe(ofActionDispatched(SettingsActions.Update))
			.subscribe(({ payload }) => {
				expect(payload).toEqual({ devMode: true });
				done();
			});

		settingsPage.updateDevMode(true);
	});

	xit("should dispatch update clear action", (done) => {
		const actions$ = spectator.inject(Actions);
		actions$
			.pipe(ofActionDispatched(SettingsActions.Clear))
			.subscribe(() => done());

		settingsPage.confirmClearData();
	});

	it("should trigger update dev mode", (done) => {
		settingsPage.versionClicksCount = 4;
		const actions$ = spectator.inject(Actions);
		actions$
			.pipe(ofActionDispatched(SettingsActions.Update))
			.subscribe(({ payload }) => {
				expect(payload).toEqual({ devMode: true });
				done();
			});

		settingsPage.handleVersionClicks();
	});

	it("should return if dev mode is already enabled", () => {
		settingsPage.updateDevMode(true);

		settingsPage.handleVersionClicks();
		expect(settingsPage.versionClicksCount).toEqual(0);
	});

	it("should open privacy policy", () => {
		settingsPage.openPrivacyPolicy();

		expect(window.open).toHaveBeenCalledWith(
			SettingsConfig.cPRIVACY_POLICY_URL,
			"_system",
		);
	});
});
