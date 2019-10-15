import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RegisterSecondPassphrasePage } from './register-second-passphrase';

import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@/pipes/pipes.module';
import { DirectivesModule } from '@/directives/directives.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    RegisterSecondPassphrasePage,
  ],
  imports: [
    IonicModule,
    CommonModule,
    DirectivesModule,
    TranslateModule,
    PipesModule,
  ],
  exports: [
    RegisterSecondPassphrasePage
  ]
})
export class RegisterSecondPassphrasePageModule {}
