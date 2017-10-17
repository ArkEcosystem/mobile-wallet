import { Injectable } from '@angular/core';
import { StorageProvider } from '@providers/storage/storage';

import { Observable, BehaviorSubject, Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';

import lodash from 'lodash';
import * as constants from '@app/app.constants';

@Injectable()
export class SettingsDataProvider {

  public settings: any;
  public onUpdated$: BehaviorSubject<any>;

  private _unsubscriber$: Subject<void> = new Subject<void>();

  private DEFAULT_OPTIONS = {
    currency: "usd",
    language: "en",
  };

  constructor(private _storageProvider: StorageProvider) {
    this._load().takeUntil(this._unsubscriber$).subscribe((data) => {
      this.settings = data;
      this.onUpdated$ = new BehaviorSubject(data);
    });
  }

  getDefaults() {
    return this.DEFAULT_OPTIONS;
  }

  private _load() {
    return Observable.create((observer) => {
      this._storageProvider.getObject(constants.STORAGE_SETTINGS).takeUntil(this._unsubscriber$).subscribe((response) => {
        let data = response;

        if (lodash.isEmpty(data)) data = this.DEFAULT_OPTIONS;

        observer.next(data);
      });
    });
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

}
