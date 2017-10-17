import { Injectable } from '@angular/core';
import { StorageProvider } from '@providers/storage/storage';

import { Observable, BehaviorSubject, Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';

import * as constants from '@app/app.constants';

@Injectable()
export class AuthProvider {

  public isLoginSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public loggedProfileId: string;
  public onSigninSubject$: BehaviorSubject<string> = new BehaviorSubject(this.loggedProfileId);

  private _unsubscriber$: Subject<void> = new Subject<void>();

  constructor(private _storage: StorageProvider) {
    this._checkLogin();
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoginSubject$.asObservable().share();
  }

  login(profileId: string, password?: string): Observable<boolean> {
    return Observable.create((observer) => {
      this.loggedProfileId = profileId;
      this._storage.set(constants.STORAGE_ACTIVE_PROFILE, profileId);
      this.onSigninSubject$.next(profileId);

      this._storage.set(constants.STORAGE_LOGIN, true);
      this.isLoginSubject$.next(true);
      observer.next(true);
    });
  }

  logout(): void {
    this._storage.set(constants.STORAGE_LOGIN, false);
    this._storage.set(constants.STORAGE_ACTIVE_PROFILE, undefined);
    this.loggedProfileId = undefined;

    this.isLoginSubject$.next(false);
  }

  hasSeenIntro(): Observable<boolean> {
    return Observable.create((observer) => {
      this._storage.getObject(constants.STORAGE_INTROSEEN).takeUntil(this._unsubscriber$).subscribe((introSeen) => {
        observer.next(introSeen);
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
      this._storage.get(constants.STORAGE_MASTERPASSWORD).takeUntil(this._unsubscriber$).subscribe((master) => {
        // TODO:
        const decrypt = constants.STORAGE_MASTERPASSWORD_VALIDATE;
        observer.next(decrypt);
        observer.complete();
      });
    });
  }

  private _checkLogin(): void {
    this._storage.getObject(constants.STORAGE_LOGIN)
      .takeUntil(this._unsubscriber$)
      .flatMap(() => this._storage.get(constants.STORAGE_ACTIVE_PROFILE))
      .subscribe((result) => {
        console.log(result);
        // this.isLoginSubject$.next(result);
      });
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

}
