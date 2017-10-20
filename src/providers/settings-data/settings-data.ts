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

  public onUpdate$: Subject<UserSettings>;

  private _settings: UserSettings;
  private _unsubscriber$: Subject<void> = new Subject<void>();

  public AVALIABLE_OPTIONS = {
    languages: {
      "en": "English",
      "pt-br": "Portuguese - Brazil",
    },
    currencies: {
      "usd": "Dolar",
      "btc": "Bitcoin",
      "brl": "Real",
    },
  }

  constructor(private _storageProvider: StorageProvider) {
    this._load().takeUntil(this._unsubscriber$).subscribe((data) => {
      this._settings = data;
      this.save();

      this.onUpdate$ = new BehaviorSubject(data);
    });
  }

  public get settings() {
    if (lodash.isEmpty(this._settings)) {
      return this._load();
    } else {
      return Observable.of(this._settings);
    }
  }

  public getDefaults(): UserSettings {
    return UserSettings.defaults();
  }

  public save(options: UserSettings = this._settings): Observable<any> {
    if (!lodash.isObject(options)) return;

    for (let prop in options) {
      this._settings[prop] = options[prop];
    }

    return this._storageProvider.set(constants.STORAGE_SETTINGS, this._settings);
  }

  public clearData() {
    return this._storageProvider.clear();
  }

  private _load(): Observable<any> {
    return Observable.create((observer) => {
      this._storageProvider.getObject(constants.STORAGE_SETTINGS).takeUntil(this._unsubscriber$).subscribe((response) => {
        let data = response;

        if (lodash.isEmpty(data)) {
          data = this.getDefaults();
        }

        observer.next(data);
      });
    });
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

}
