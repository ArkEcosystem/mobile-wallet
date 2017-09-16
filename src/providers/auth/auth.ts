import { Injectable } from '@angular/core';
import { StorageProvider } from '@providers/storage/storage';

import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';

import * as constants from '@app/app.constants';

@Injectable()
export class AuthProvider {

  public loggedIn: boolean = false;
  public logoutObserver: BehaviorSubject<boolean> = new BehaviorSubject(true);

  public activeProfileId: string;
  public activeProfileObserver: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(private storage: StorageProvider) {
    this.activeProfileGet().subscribe((id) => {
      this.activeProfileId = id;
      this.activeProfileObserver.next(id);
    });
  }

  login(profileId: string, password?: string): Observable<boolean> {
    return Observable.create((observer) => {
      this.masterPasswordHasSet().subscribe((result) => {
        if (!result) {
          this.loggedIn = true;
          this.activeProfileSet(profileId);
        } else if (result && !password) {
          observer.error('Need masterpassword');
        } else if (result && password) {
          if (this.masterPasswordValidate(password)) {
            this.loggedIn = true;
            this.activeProfileSet(profileId);
          } else {
            observer.error('Invalid masterpassword');
          }
        }

        observer.next(this.loggedIn);
        observer.complete();
      });
    });
  }

  logout() {
    this.loggedIn = false;
    this.activeProfileSet();

    this.logoutObserver.next(true);
  }

  activeProfileSet(id?: string): void {
    this.activeProfileId = id;
    this.activeProfileObserver.next(id);

    this.storage.set(constants.STORAGE_ACTIVE_PROFILE, id);
  }

  activeProfileGet(): Observable<string> {
    return this.storage.get(constants.STORAGE_ACTIVE_PROFILE);
  }

  introHasSeen(): Observable<boolean> {
    return Observable.create((observer) => {
      this.storage.get(constants.STORAGE_INTROSEEN).subscribe((introSeen) => {
        observer.next(introSeen == 'true');
        observer.complete();
      });
    });
  }

  introSetSeen() {
    this.storage.set(constants.STORAGE_INTROSEEN, true);
  }

  masterPasswordHasSet() {
    return this.storage.get(constants.STORAGE_MASTERPASSWORD);
  }

  masterPasswordSet(password: string) {
    // TODO:
    const encrypt = constants.STORAGE_MASTERPASSWORD_VALIDATE;

    this.storage.set(constants.STORAGE_MASTERPASSWORD, encrypt);
  }

  masterPasswordValidate(password: string) {
    return Observable.create((observer) => {
      this.storage.get(constants.STORAGE_MASTERPASSWORD).subscribe((master) => {
        // TODO:
        const decrypt = constants.STORAGE_MASTERPASSWORD_VALIDATE;
        observer.next(decrypt);
        observer.complete();
      });
    });
  }

}
