import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import lodash from "lodash";
import { Observable, of, Subject } from "rxjs";
import { tap } from "rxjs/operators";

import * as constants from "@/app/app.constants";
import { UserSettings } from "@/models/settings";
import { StorageProvider } from "@/services/storage/storage";

@Injectable({ providedIn: "root" })
export class SettingsDataProvider {
	public onUpdate$: Subject<UserSettings> = new Subject();
	public AVALIABLE_OPTIONS = {
		languages: {
			en: "English",
			de: "Deutsch",
			fr: "French",
			id: "Indonesia",
			it: "Italiano",
			nl: "Nederlands",
			sv: "Svenska",
			ru: "Русский",
			gr: "Ελληνικά",
			"pt-br": "Português",
			cs: "Čeština",
			kor: "한국어",
			bg: "Български",
			pl: "Polish",
			zh: "中文",
		},
		currencies: {
			btc: "Bitcoin",
			usd: "Dollar",
			eur: "Euro",
			gbp: "British Pound",
			krw: "South Korean Won",
			cny: "Chinese Yuan",
			jpy: "Japanese Yen",
			aud: "Australian Dollar",
			cad: "Canadian Dollar",
			rub: "Russian Ruble",
			inr: "Indian Rupee",
			brl: "Brazilian Real",
			chf: "Swiss Franc",
			hkd: "Hong Kong Dollar",
			idr: "Indonesian Rupiah",
			mxn: "Mexican Peso",
			czk: "Česká koruna",
		},
		wordlistLanguages: {
			english: "English",
			french: "French",
			spanish: "Spanish",
			italian: "Italian",
			japanese: "Japanese",
			korean: "Korean",
			chinese_simplified: "Chinese simplified",
			chinese_traditional: "Chinese traditional",
		},
	};
	private _settings: UserSettings;

	constructor(
		private _storageProvider: StorageProvider,
		private translateService: TranslateService,
	) {
		this.load().subscribe((data) => {
			this._settings = data;
			this.save();
		});
	}

	public get settings() {
		if (lodash.isEmpty(this._settings)) {
			return this.load();
		} else {
			return of(this._settings);
		}
	}

	public getDefaults(): UserSettings {
		const cultureLang = this.translateService.getBrowserCultureLang();
		const browserLang = this.translateService.getBrowserLang();
		const appLang = this.AVALIABLE_OPTIONS.languages[cultureLang]
			? cultureLang
			: this.AVALIABLE_OPTIONS.languages[browserLang]
			? browserLang
			: "en";

		return UserSettings.defaults(appLang);
	}

	public save(options?: UserSettings): Observable<any> {
		const settings = options || this._settings;

		for (const prop in options) {
			if (prop) {
				this._settings[prop] = settings[prop];
			}
		}
		if (options) {
			this.onUpdate$.next(this._settings);
		}
		return this._storageProvider.set(
			constants.STORAGE_SETTINGS,
			this._settings,
		);
	}

	public clearData() {
		return this._storageProvider.clear().pipe(
			tap(() => {
				this._settings = undefined;
			}),
		);
	}

	private load(): Observable<UserSettings> {
		return new Observable((observer) => {
			this._storageProvider
				.getObject(constants.STORAGE_SETTINGS)
				.subscribe((response) => {
					let data = response;

					if (lodash.isEmpty(data)) {
						data = this.getDefaults();
					}

					observer.next(data);
				});
		});
	}
}
