import { TestBed } from "@angular/core/testing";
import { IonicStorageModule } from "@ionic/storage";
import { TranslateModule } from "@ngx-translate/core";

import { UserSettings } from "@/models/settings";

import { SettingsDataProvider } from "./settings-data";

describe("Settings Service", () => {
	let settingsService: SettingsDataProvider;

	beforeAll(() => {
		TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot(), IonicStorageModule.forRoot()],
			providers: [SettingsDataProvider],
		});

		settingsService = TestBed.inject(SettingsDataProvider);
	});

	it("should return valid settings", done => {
		settingsService.settings.subscribe(data => {
			expect(data).toEqual(
				jasmine.objectContaining({
					language: jasmine.any(String),
					currency: jasmine.any(String),
					wordlistLanguage: jasmine.any(String),
					darkMode: jasmine.any(Boolean),
				}),
			);
			done();
		});
	});

	it("should return the default settings", () => {
		expect(settingsService.getDefaults()).toEqual(
			jasmine.objectContaining({
				language: "en",
				currency: "usd",
				wordlistLanguage: "english",
				darkMode: false,
				notification: false,
			}),
		);
	});

	it("should update settings", done => {
		const newSettings = new UserSettings();
		newSettings.language = "pt-BR";
		newSettings.currency = "BRL";
		newSettings.wordlistLanguage = "portuguese";
		newSettings.darkMode = true;
		newSettings.notification = true;

		settingsService.save(newSettings);

		settingsService.settings.subscribe(data => {
			expect(data).toEqual(
				jasmine.objectContaining({
					language: "pt-BR",
					currency: "BRL",
					wordlistLanguage: "portuguese",
					darkMode: true,
					notification: true,
				}),
			);
			done();
		});
	});
});
