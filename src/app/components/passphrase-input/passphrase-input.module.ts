import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PassphraseInputComponent } from '@/components/passphrase-input/passphrase-input';
import { DirectivesModule } from '@/directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PassphraseInputComponent],
  imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    CommonModule,
    TranslateModule
  ],
  exports: [PassphraseInputComponent]
})
export class PassphraseInputComponentModule { }
