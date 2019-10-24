import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Subject, from } from 'rxjs';

import { isObject, isString, toString } from 'lodash';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class StorageProvider {

  public onClear$: Subject<void> = new Subject<void>();

  constructor(private _storage: Storage) { }

  public get(key) {
    return from(this._storage.get(key));
  }

  public getObject(key) {
    return from(this._storage.get(key)).pipe(
      map((result) => JSON.parse(result || '{}'))
    )
  }

  public set(key, value) {
    if (isObject(value)) {
      value = JSON.stringify(value);
    }

    if (value && !isString(value)) {
      value = toString(value);
    }

    return from(this._storage.set(key, value));
  }

  public clear() {
    from(this._storage.clear());
    return this.onClear$.next();
  }

}
