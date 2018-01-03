import { Injectable } from '@angular/core';
import { StorageProvider } from '@providers/storage/storage';

import { Observable, BehaviorSubject, Subject } from 'rxjs';
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
      "en": "English",
      "it": "Italiano",
      "sv": "Svenska"
    },
    currencies: {
      "btc": "Bitcoin",
      "usd": "Dollar",
      "eur": "Euro",
      "gbp": "British Pound",
      "krw": "South Korean Won",
      "cny": "Chinese Yuan",
      "jpy": "Japanese Yen",
      "aud": "Australian Dollar",
      "cad": "Canadian Dollar",
      "rub": "Russian Ruble",
      "inr": "Indian Rupee",
      "brl": "Brazilian Real",
      "chf": "Swiss Franc",
      "hkd": "Hong Kong Dollar",
      "idr": "Indonesian Rupiah",
      "mxn": "Mexican Peso",
    },
  }

  constructor(private _storageProvider: StorageProvider) {
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
    return UserSettings.defaults();
  }

  public save(options?: UserSettings): Observable<any> {
    let settings = options || this._settings;

    for (let prop in options) {
      this._settings[prop] = settings[prop];
    }

    if (options) this.onUpdate$.next(this._settings);
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
