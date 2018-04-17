import { Injectable } from '@angular/core';
import { StorageProvider } from '@providers/storage/storage';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';

import lodash from 'lodash';
import { UserSettings } from '@models/settings';
import * as constants from '@app/app.constants';

@Injectable()
export class SettingsDataProvider {

  public onUpdate$: Subject<UserSettings> = new Subject();

  private _settings: UserSettings;

  public AVALIABLE_OPTIONS = {
    languages: {
      'en': 'English',
      'de': 'Deutsch',
      'fr': 'French',
      'it': 'Italiano',
      'nl': 'Nederlands',
      'sv': 'Svenska',
      'ru': 'Русский',
      'gr': 'Ελληνικά',
      'pt-br': 'Português',
      'cs': 'Čeština',
      'kor': '한국어',
      'bg': 'Български'
    },
    currencies: {
      'btc': 'Bitcoin',
      'usd': 'Dollar',
      'eur': 'Euro',
      'gbp': 'British Pound',
      'krw': 'South Korean Won',
      'cny': 'Chinese Yuan',
      'jpy': 'Japanese Yen',
      'aud': 'Australian Dollar',
      'cad': 'Canadian Dollar',
      'rub': 'Russian Ruble',
      'inr': 'Indian Rupee',
      'brl': 'Brazilian Real',
      'chf': 'Swiss Franc',
      'hkd': 'Hong Kong Dollar',
      'idr': 'Indonesian Rupiah',
      'mxn': 'Mexican Peso',
      'czk': 'Česká koruna'
    },
    wordlistLanguages: {
    'english': 'English',
    'french': 'French',
    'spanish': 'Spanish',
    'italian': 'Italian',
    'japanese': 'Japanese',
    'korean': 'Korean',
    'chinese_simplified': 'Chinese simplified',
    'chinese_traditional': 'Chinese traditional'
    }
  };

  constructor(private _storageProvider: StorageProvider, private translateService: TranslateService) {
    this.load().subscribe((data) => {
      this._settings = data;
      this.save();
    });
  }

  public get settings() {
    if (lodash.isEmpty(this._settings)) {
      return this.load();
    } else {
      return Observable.of(this._settings);
    }
  }

  public getDefaults(): UserSettings {
    const cultureLang = this.translateService.getBrowserCultureLang();
    const browserLang = this.translateService.getBrowserLang();
    const appLang = this.AVALIABLE_OPTIONS.languages[cultureLang] ? cultureLang
      : this.AVALIABLE_OPTIONS.languages[browserLang] ? browserLang
      : 'en';

    return UserSettings.defaults(appLang);
  }

  public save(options?: UserSettings): Observable<any> {
    const settings = options || this._settings;

    for (const prop in options) {
      this._settings[prop] = settings[prop];
    }

    if (options) { this.onUpdate$.next(this._settings); }
    return this._storageProvider.set(constants.STORAGE_SETTINGS, this._settings);
  }

  public clearData(): void {
    this._storageProvider.clear();
  }

  private load(): Observable<UserSettings> {
    return Observable.create((observer) => {
      this._storageProvider.getObject(constants.STORAGE_SETTINGS).subscribe((response) => {
        let data = response;

        if (lodash.isEmpty(data)) {
          data = this.getDefaults();
        }

        observer.next(data);
      });
    });
  }

}
