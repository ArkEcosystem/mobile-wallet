import { Injectable } from '@angular/core';
import { StorageProvider } from '@providers/storage/storage';

import { Observable, Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';

import * as constants from '@app/app.constants';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthProvider {

  public onLogin$: Subject<string> = new Subject();
  public onLogout$: Subject<boolean> = new Subject();

  public loggedProfileId: string;

  constructor(
    private storage: StorageProvider
  ) { }

  login(profileId: string): Observable<boolean> {
    return Observable.create((observer) => {
      this.loggedProfileId = profileId;
      this.storage.set(constants.STORAGE_ACTIVE_PROFILE, profileId);

      this.storage.set(constants.STORAGE_LOGIN, true);

      this.onLogin$.next(profileId);
      observer.next(true);
    });
  }

  logout(broadcast: boolean = true): void {
    this.storage.set(constants.STORAGE_LOGIN, false);
    this.storage.set(constants.STORAGE_ACTIVE_PROFILE, undefined);
    this.loggedProfileId = undefined;

    if (broadcast) this.onLogout$.next(false);
  }

  hasSeenIntro(): Observable<boolean> {
    return Observable.create((observer) => {
      this.storage.get(constants.STORAGE_INTROSEEN).subscribe((introSeen) => {
        observer.next(introSeen === 'true');
        observer.complete();
      });
    });
  }

  saveIntro(): void {
    this.storage.set(constants.STORAGE_INTROSEEN, true);
  }

  getMasterPassword(): Observable<string> {
    return this.storage.get(constants.STORAGE_MASTERPASSWORD);
  }

  saveMasterPassword(password: string): void {
    let hash = bcrypt.hashSync(password, 8);

    this.storage.set(constants.STORAGE_MASTERPASSWORD, hash);
  }

  validateMasterPassword(password: string): Observable<any> {
    return Observable.create((observer) => {
      this.storage.get(constants.STORAGE_MASTERPASSWORD).subscribe((master) => {
        bcrypt.compare(password, master, (err, res) => {
          if (err) observer.error(err);

          observer.next(res);
          observer.complete();
        });
      });
    });
  }

}
