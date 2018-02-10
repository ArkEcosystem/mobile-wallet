import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';

import { isObject, isString, toString } from 'lodash';

@Injectable()
export class StorageProvider {

  public onClear$: Subject<void> = new Subject<void>();

  constructor(private _storage: Storage) { }

  public get(key) {
    return Observable.fromPromise(this._storage.get(key));
  }

  public getObject(key) {
    return Observable.fromPromise(this._storage.get(key)).map((result) => JSON.parse(result || '{}'));
  }

  public set(key, value) {
    if (isObject(value)) {
      value = JSON.stringify(value);
    }

    if (value && !isString(value)) {
      value = toString(value);
    }

    return Observable.fromPromise(this._storage.set(key, value));
  }

  public clear() {
    Observable.fromPromise(this._storage.clear());
    return this.onClear$.next();
  }

}
