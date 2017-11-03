import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DelegatesPage } from './delegates';

import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@pipes/pipes.module';
import { FilterPipeModule } from 'ngx-filter-pipe';

@NgModule({
  declarations: [
    DelegatesPage,
  ],
  imports: [
    IonicPageModule.forChild(DelegatesPage),
    TranslateModule,
    PipesModule,
    FilterPipeModule,
  ],
})
export class DelegatesPageModule {}
