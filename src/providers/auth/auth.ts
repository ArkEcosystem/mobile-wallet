import { Injectable } from '@angular/core';
import { StorageProvider } from '@providers/storage/storage';

import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthProvider {

  private STORAGE_ACTIVE_PROFILE = 'active_profile';
  private STORAGE_ACTIVE_WALLET = 'active_wallet';
  private STORAGE_INTROSEEN = 'intro';

  private STORAGE_MASTERPASSWORD = 'masterpassword';
  private STORAGE_MASTERPASSWORD_VALIDATE = 'ark';
  private SECURESTORAGE_PASSPHRASES = 'passphrases';

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

  activeWalletSet(address?: string): void {
    this.storage.set(this.STORAGE_ACTIVE_WALLET, address);
  }

  activeWalletGet() {
    return this.storage.get(this.STORAGE_ACTIVE_WALLET);
  }

  activeProfileSet(id?: string): void {
    this.activeProfileId = id;
    this.activeProfileObserver.next(id);

    this.storage.set(this.STORAGE_ACTIVE_PROFILE, id);
  }

  activeProfileGet(): Observable<string> {
    return this.storage.get(this.STORAGE_ACTIVE_PROFILE);
  }

  introHasSeen(): Observable<boolean> {
    return Observable.create((observer) => {
      this.storage.get(this.STORAGE_INTROSEEN).subscribe((introSeen) => {
        observer.next(introSeen == 'true');
        observer.complete();
      });
    });
  }

  introSetSeen() {
    this.storage.set(this.STORAGE_INTROSEEN, true);
  }

  masterPasswordHasSet() {
    return this.storage.get(this.STORAGE_MASTERPASSWORD);
  }

  masterPasswordSet(password: string) {
    // TODO:
    const encrypt = this.STORAGE_MASTERPASSWORD_VALIDATE;

    this.storage.set(this.STORAGE_MASTERPASSWORD, encrypt);
  }

  masterPasswordValidate(password: string) {
    return Observable.create((observer) => {
      this.storage.get(this.STORAGE_MASTERPASSWORD).subscribe((master) => {
        // TODO:
        const decrypt = this.STORAGE_MASTERPASSWORD_VALIDATE;
        observer.next(decrypt);
        observer.complete();
      });
    });
  }

}
