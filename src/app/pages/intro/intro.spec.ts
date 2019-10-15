import { async } from '@angular/core/testing'
import { TestHelpers } from '../../../test/helpers'
import { IntroPage } from './intro'

describe('Pages: Intro', () => {
  let instance: any = null;

  beforeEach(async(() => TestHelpers.beforeEachCompiler([IntroPage]).then(compiled => {
    instance = compiled.instance;
  })));

  it('should create the Intro page', () => {
    expect(instance).toBeDefined();
  });
});
