import { Injectable } from '@angular/core';
import { StorageProvider } from '@providers/storage/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AuthProvider {

  private STORAGE_ACTIVE_PROFILE = 'active_profile';
  private STORAGE_ACTIVE_WALLET = 'active_wallet';
  private STORAGE_INTROSEEN = 'intro';

  private STORAGE_MASTERPASSWORD = 'masterpassword';
  private STORAGE_MASTERPASSWORD_VALIDATE = 'ark';
  private SECURESTORAGE_PASSPHRASES = 'passphrases';

  public loggedIn: boolean = false;

  constructor(private storage: StorageProvider) { }

  login(profileId: string, password?: string) {
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

        observer.complete();
      });
    });
  }

  activeWalletSet(address?: string): void {
    this.storage.set(this.STORAGE_ACTIVE_WALLET, address);
  }

  activeWalletGet() {
    return this.storage.get(this.STORAGE_ACTIVE_WALLET);
  }

  activeProfileSet(id?: string): void {
    this.storage.set(this.STORAGE_ACTIVE_PROFILE, id);
  }

  activeProfileGet(): Observable<string> {
    return this.storage.get(this.STORAGE_ACTIVE_PROFILE);
  }

  introHasSeen(): Observable<boolean> {
    return Observable.create((observer) => {
      this.storage.get(this.STORAGE_INTROSEEN).subscribe((introSeen) => {
        observer.next(introSeen === true);
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
