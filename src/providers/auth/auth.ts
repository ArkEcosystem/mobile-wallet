import { Injectable } from '@angular/core';
import { StorageProvider } from '@providers/storage/storage';

import { Observable, BehaviorSubject, Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';

import * as constants from '@app/app.constants';
import lodash from 'lodash';

@Injectable()
export class AuthProvider {

  public onLogin$: Subject<string> = new Subject();
  public onLogout$: Subject<boolean> = new Subject();

  public loggedProfileId: string;

  constructor(private _storage: StorageProvider) {
    this._checkLogin();
  }

  login(profileId: string, password?: string): Observable<boolean> {
    return Observable.create((observer) => {
      this.loggedProfileId = profileId;
      this._storage.set(constants.STORAGE_ACTIVE_PROFILE, profileId);

      this._storage.set(constants.STORAGE_LOGIN, true);

      this.onLogin$.next(profileId);
      observer.next(true);
    });
  }

  logout(): void {
    this._storage.set(constants.STORAGE_LOGIN, false);
    this._storage.set(constants.STORAGE_ACTIVE_PROFILE, undefined);
    this.loggedProfileId = undefined;

    this.onLogout$.next(false);
  }

  hasSeenIntro(): Observable<boolean> {
    return Observable.create((observer) => {
      this._storage.get(constants.STORAGE_INTROSEEN).subscribe((introSeen) => {
        observer.next(introSeen === 'true');
        observer.complete();
      });
    });
  }

  saveIntro(): void {
    this._storage.set(constants.STORAGE_INTROSEEN, true);
  }

  getMasterPassword(): Observable<string> {
    return this._storage.get(constants.STORAGE_MASTERPASSWORD);
  }

  saveMasterPassword(password: string): void {
    // TODO:
    const encrypt = constants.STORAGE_MASTERPASSWORD_VALIDATE;

    this._storage.set(constants.STORAGE_MASTERPASSWORD, encrypt);
  }

  validateMasterPassword(password: string): Observable<any> {
    return Observable.create((observer) => {
      this._storage.get(constants.STORAGE_MASTERPASSWORD).subscribe((master) => {
        // TODO:
        const decrypt = constants.STORAGE_MASTERPASSWORD_VALIDATE;
        observer.next(decrypt);
        observer.complete();
      });
    });
  }

  private _checkLogin(): void {
    this._storage.getObject(constants.STORAGE_LOGIN)
      .flatMap(() => this._storage.get(constants.STORAGE_ACTIVE_PROFILE))
      .subscribe((result) => {
        // TODO:
        // this.isLoginSubject$.next(result);
      });
  }


}
