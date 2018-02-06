import { ComponentFixture, async } from '@angular/core/testing'
import { TestUtils } from '../../test'
import { IntroPage } from './intro'

describe('Pages: Login', () => {
	let fixture: ComponentFixture<IntroPage> = null;
	let instance: any = null;

	beforeEach(async(() => TestUtils.beforeEachCompiler([IntroPage]).then(compiled => {
		fixture = compiled.fixture;
		instance = compiled.instance;
	})));

	it('should create the Intro page', async(() => {
		expect(instance).toBeTruthy();
	}));
});
