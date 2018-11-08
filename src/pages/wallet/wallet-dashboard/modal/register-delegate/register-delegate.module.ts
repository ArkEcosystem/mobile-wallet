import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterDelegatePage } from './register-delegate';

import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '@directives/directives.module';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [
    RegisterDelegatePage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterDelegatePage),
    DirectivesModule,
    TranslateModule,
    PipesModule,
  ],
})
export class RegisterDelegatePageModule {}
