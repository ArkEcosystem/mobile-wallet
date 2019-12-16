import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RegisterSecondPassphrasePage } from './register-second-passphrase';

import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '@/pipes/pipes.module';
import { DirectivesModule } from '@/directives/directives.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RegisterSecondPassphrasePage,
  ],
  imports: [
    IonicModule,
    FormsModule,
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
