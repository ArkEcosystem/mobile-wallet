import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PassphraseInputComponent } from '@/components/passphrase-input/passphrase-input';
import { DirectivesModule } from '@/directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [PassphraseInputComponent],
  imports: [
    IonicModule,
    DirectivesModule,
    CommonModule,
    TranslateModule
  ],
  exports: [PassphraseInputComponent]
})
export class PassphraseInputComponentModule { }
