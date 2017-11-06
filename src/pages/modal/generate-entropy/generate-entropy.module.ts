import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GenerateEntropyPage } from './generate-entropy';

import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@components/components.module';

@NgModule({
  declarations: [
    GenerateEntropyPage,
  ],
  imports: [
    IonicPageModule.forChild(GenerateEntropyPage),
    TranslateModule,
    ComponentsModule,
  ],
})
export class GenerateEntropyPageModule {}
