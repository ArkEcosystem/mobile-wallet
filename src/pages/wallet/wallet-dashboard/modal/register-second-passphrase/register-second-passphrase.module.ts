import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterSecondPassphrasePage } from './register-second-passphrase';

import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@pipes/pipes.module';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [
    RegisterSecondPassphrasePage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterSecondPassphrasePage),
    DirectivesModule,
    TranslateModule,
    PipesModule,
  ],
})
export class RegisterSecondPassphrasePageModule {}
