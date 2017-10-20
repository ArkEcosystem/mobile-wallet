import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/frompromise';
import 'rxjs/add/operator/map';

import lodash from 'lodash';

@Injectable()
export class StorageProvider {

  constructor(private _storage: Storage) { }

  public get(key) {
    return Observable.fromPromise(this._storage.get(key));
  }

  public getObject(key) {
    return Observable.fromPromise(this._storage.get(key)).map((result) => JSON.parse(result || "{}"));
  }

  public set(key, value) {
    if (lodash.isObject(value)) {
      value = JSON.stringify(value);
    }

    if (value && !lodash.isString(value)) {
      value = lodash(value).toString();
    }

    return Observable.fromPromise(this._storage.set(key, value));
  }

}
