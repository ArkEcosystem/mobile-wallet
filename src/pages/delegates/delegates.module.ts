import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DelegatesPage } from './delegates';

import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    DelegatesPage,
  ],
  imports: [
    IonicPageModule.forChild(DelegatesPage),
    TranslateModule,
    PipesModule,
  ],
})
export class DelegatesPageModule {}
