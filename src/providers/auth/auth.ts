import { Injectable } from '@angular/core';
import { StorageProvider } from '@providers/storage/storage';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/share';

import * as constants from '@app/app.constants';
import * as bcrypt from 'bcryptjs';
import moment from 'moment';

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

    if (broadcast) { this.onLogout$.next(false); }
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
    const hash = bcrypt.hashSync(password, 8);

    this.storage.set(constants.STORAGE_MASTERPASSWORD, hash);
  }

  validateMasterPassword(password: string): Observable<any> {
    return Observable.create((observer) => {
      this.storage.get(constants.STORAGE_MASTERPASSWORD).subscribe((master) => {
        bcrypt.compare(password, master, (err, res) => {
          if (err) { observer.error(err); }

          observer.next(res);
          observer.complete();
        });
      });
    });
  }

  isWeakPassword(password: string): boolean {
    const weakPasswords = [
      '000000', '111111', '222222', '333333', '444444',
      '555555', '666666', '777777', '888888', '999999',
      '012345', '123456', '234567', '345678', '456789',
      '567890', '543210', '654321', '765432', '876543',
      '987654', '098765'
    ];
    return weakPasswords.indexOf(password) > -1;
  }

  getUnlockTimestamp() {
    return this.storage.getObject(constants.STORAGE_AUTH_UNLOCK_TIMESTAMP);
  }

  getAttempts() {
    return this.storage.get(constants.STORAGE_AUTH_ATTEMPTS);
  }

  increaseAttempts() {
    return this.getAttempts().mergeMap(attempts => {
      const increasedAttempts = Number(attempts) + 1;
      return this.storage.set(constants.STORAGE_AUTH_ATTEMPTS, increasedAttempts).map(() => increasedAttempts);
    });
  }

  increaseUnlockTimestamp(): Promise<Date> {
    return new Promise(resolve => {
      this.getAttempts().subscribe((attempts) => {
        const currentAttempt = (Number(attempts) - constants.PIN_ATTEMPTS_LIMIT) + 1;
        const lastTimestamp = moment(moment.now());
        const nextTimestamp = lastTimestamp.add(constants.PIN_ATTEMPTS_TIMEOUT_MILLISECONDS * currentAttempt, 'ms').toDate();
        this.storage.set(constants.STORAGE_AUTH_UNLOCK_TIMESTAMP, nextTimestamp);
        resolve(nextTimestamp);
      });
    });
  }

  clearAttempts() {
    this.storage.set(constants.STORAGE_AUTH_UNLOCK_TIMESTAMP, null);
    this.storage.set(constants.STORAGE_AUTH_ATTEMPTS, 0);
  }

}
