import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntroPage } from './intro';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    IntroPage,
  ],
  imports: [
    IonicPageModule.forChild(IntroPage),
    TranslateModule
  ],
})
export class IntroPageModule {}
