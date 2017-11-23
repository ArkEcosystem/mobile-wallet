import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GenerateEntropyModal } from './generate-entropy';

import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@components/components.module';

@NgModule({
  declarations: [
    GenerateEntropyModal,
  ],
  imports: [
    IonicPageModule.forChild(GenerateEntropyModal),
    TranslateModule,
    ComponentsModule,
  ],
})
export class GenerateEntropyModalModule {}
