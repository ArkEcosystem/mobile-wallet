// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
// // @see https://github.com/angular/zone.js/issues/1015
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';

import { getTestBed, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { ConfigMock, PlatformMock } from 'ionic-mocks';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import {
  App,
  Config,
  DeepLinker,
  Form,
  IonicModule,
  Keyboard,
  DomController,
  MenuController,
  NavController,
  ModalController,
  GestureController,
  LoadingController,
  Platform,
} from 'ionic-angular';

// import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { AuthProvider } from '@providers/auth/auth';
import { ToastProvider } from '@providers/toast/toast';
import { UserDataProvider } from '@providers/user-data/user-data';

import {
  ArkApiProviderMock,
  AuthProviderMock,
  DeepLinkerMock,
  ToastProviderMock,
  TranslateLoaderMock,
  UserDataProviderMock
} from './mocks';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
// Then we find all the tests.
const context: any = require.context('../src/', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);

export class TestHelpers {

  public static beforeEachCompiler(components: Array<any>): Promise<{fixture: any, instance: any}> {
    const testingModule = TestHelpers.configureIonicTestingModule(components)
    const testComponents = testingModule.compileComponents()

    return new Promise((resolve, reject) => {
      testComponents
        .then(() => {
          let fixture: any = TestBed.createComponent(components[0]);
          resolve({
            fixture,
            instance: fixture.debugElement.componentInstance,
          });
        })
        .catch(reject)
    })
  }

  public static configureIonicTestingModule(components: Array<any>): typeof TestBed {
    return TestBed.configureTestingModule({
      declarations: [
        ...components,
      ],
      imports: [
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      providers: [
        App, Form, Keyboard, DomController, MenuController, NavController, ModalController, GestureController, LoadingController,
        {provide: Platform, useFactory: () => PlatformMock.instance()},
        {provide: Config, useFactory: () => ConfigMock.instance()},
        {provide: DeepLinker, useClass: DeepLinkerMock},
        // {provide: ArkApiProvider, useClass: ArkApiProviderMock},
        {provide: AuthProvider, useClass: AuthProviderMock},
        {provide: ToastProvider, useClass: ToastProviderMock},
        {provide: UserDataProvider, useClass: UserDataProviderMock},
      ],
    });
  }

  // http://stackoverflow.com/questions/2705583/how-to-simulate-a-click-with-javascript
  public static eventFire(el: any, etype: string): void {
    if (el.fireEvent) {
      el.fireEvent('on' + etype);
    } else {
      let evObj: any = document.createEvent('Events');
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  }
}
