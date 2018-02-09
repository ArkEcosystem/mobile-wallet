import { EventEmitter, Pipe } from '@angular/core';
import { Observable } from 'rxjs';

export class ArkApiProviderMock {
}

export class AuthProviderMock {
  getMasterPassword(): Observable<string> {
    return Observable.of('My secret password')
  }
}

export class DeepLinkerMock {
}

export class TranslateServiceMock {

  public currentLang: string = 'en';

  public get(value: any): Observable<string> {
    return Observable.of(value);
  }

  public onLangChange: EventEmitter<string> = new EventEmitter();
  public onDefaultLangChange: EventEmitter<string> = new EventEmitter();

  /* tslint:disable */
  public use(value: any): void {}
  public set(lang: string): void {}
  public setDefaultLang(lang: string): void {}
 /* tslint:enable */
}

@Pipe({name: 'translate'})
export class TranslatePipeMock {
  public transform(): string {
    return '';
  }
}

export class ToastProviderMock {
}

export class TranslateLoaderMock {
  getTranslation(lang: string) {
    const translations: any = { 'EXAMPLE': 'simplest example' };
    return Observable.of(translations);
  }
}

export class UserDataProviderMock {
  public profiles = {};
}
