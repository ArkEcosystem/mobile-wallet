import { TestBed } from "@angular/core/testing";
import { IonicStorageModule } from "@ionic/storage";
import { TranslateModule } from "@ngx-translate/core";

import { SettingsDataProvider } from "./settings-data";

fdescribe("Settings Service", () => {
	let settingsService: SettingsDataProvider;

	beforeEach(() => {
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
});
