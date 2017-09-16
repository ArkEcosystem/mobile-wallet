import { Injectable } from '@angular/core';
import { StorageProvider } from '@providers/storage/storage';

import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';

import lodash from 'lodash';
import * as constants from '@app/app.constants';

@Injectable()
export class SettingsDataProvider {

  public settings: any;
  public settingsObserver: BehaviorSubject<any> = new BehaviorSubject(this.settings);

  private DEFAULT_OPTIONS = {
    currency: "usd",
    language: "en",
  };

  constructor(private storageProvider: StorageProvider) {
    this._load().subscribe((data) => {
      this.settings = data;
      this.settingsObserver.next(data);
    });
  }

  getDefaults() {
    return this.DEFAULT_OPTIONS;
  }

  private _load() {
    return Observable.create((observer) => {
      this.storageProvider.getObject(constants.STORAGE_SETTINGS).subscribe((response) => {
        let data = response;

        if (lodash.isEmpty(data)) data = this.DEFAULT_OPTIONS;

        observer.next(data);
      });
    });
  }

}
