import { async } from '@angular/core/testing'
import { TestHelpers } from '../../../test/helpers'
import { LoginPage } from './login'
import { PinCodeComponent } from '@components/pin-code/pin-code';

describe('Pages: Login', () => {
	let instance: any = null;

  beforeEach(async(() => TestHelpers.beforeEachCompiler([LoginPage, PinCodeComponent]).then(compiled => {
    instance = compiled.instance;
  })));

	it('should create the Login page', () => {
		expect(instance).toBeDefined();
	});
});
