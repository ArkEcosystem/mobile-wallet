import { TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { NgxsModule, Store } from "@ngxs/store";
import { of } from "rxjs";

import { SettingsActions } from "./settings.actions";
import { SettingsService } from "./settings.service";
import { SETTINGS_STATE_TOKEN, SettingsState } from "./settings.state";
import { SettingsStateModel } from "./settings.type";

describe("Settings State", () => {
	const defaultState: SettingsStateModel = {
		language: "en",
		currency: "usd",
		wordlistLanguage: "english",
		darkMode: false,
		devMode: false,
	};
	const settingsServiceSpy = {
		clear: () => of({}),
	};
	let store: Store;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				NgxsModule.forRoot([SettingsState]),
				TranslateModule.forRoot(),
			],
			providers: [
				{
					provide: SettingsService,
					useValue: settingsServiceSpy,
				},
			],
		});

		store = TestBed.get(Store);
	});

	it("should create", () => {
		const state = store.selectSnapshot(SETTINGS_STATE_TOKEN);
		expect(state).toEqual(defaultState);
	});

	it("should return darkMode", () => {
		const darkMode = store.selectSnapshot(SettingsState.darkMode);
		expect(darkMode).toEqual(false);
	});

	it("should return devMode", () => {
		const devMode = store.selectSnapshot(SettingsState.devMode);
		expect(devMode).toEqual(false);
	});

	it("should return wordlistLanguage", () => {
		const wordlistLanguage = store.selectSnapshot(
			SettingsState.wordlistLanguage,
		);
		expect(wordlistLanguage).toEqual("english");
	});

	it("should return currency", () => {
		const currency = store.selectSnapshot(SettingsState.currency);
		expect(currency).toEqual("usd");
	});

	it("should return language", () => {
		const language = store.selectSnapshot(SettingsState.language);
		expect(language).toEqual("en");
	});

	it("should update", () => {
		store.dispatch(new SettingsActions.Update({ darkMode: true }));
		const darkMode = store.selectSnapshot(SettingsState.darkMode);
		expect(darkMode).toEqual(true);
	});

	it("should clear", () => {
		store.dispatch(new SettingsActions.Update({ darkMode: true }));
		store.dispatch(new SettingsActions.Clear());

		const settings = store.selectSnapshot(SettingsState);
		expect(settings).toEqual(defaultState);
	});
});
