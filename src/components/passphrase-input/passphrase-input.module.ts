import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { PassphraseInputComponent } from '@components/passphrase-input/passphrase-input';
import { DirectivesModule } from '@directives/directives.module';

@NgModule({
  declarations: [PassphraseInputComponent],
  imports: [IonicModule,
    DirectivesModule
  ],
  exports: [PassphraseInputComponent]
})
export class PassphraseInputComponentModule { }
