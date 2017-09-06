import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/frompromise';
import 'rxjs/add/operator/map';

import lodash from 'lodash';
/*
  Generated class for the StorageProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class StorageProvider {

  constructor(public storage: Storage) { }

  public get(key) {
    return Observable.fromPromise(this.storage.get(key));
  }

  public getObject(key) {
    return Observable.fromPromise(this.storage.get(key)).map((result) => JSON.parse(result || "{}"));
  }

  public set(key, value) {
    if (lodash.isObject(value)) {
      value = JSON.stringify(value);
    }

    if (value && !lodash.isString(value)) {
      value = lodash(value).toString();
    }

    return Observable.fromPromise(this.storage.set(key, value));
  }

}
