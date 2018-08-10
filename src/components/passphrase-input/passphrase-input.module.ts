import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { PassphraseInputComponent } from '@components/passphrase-input/passphrase-input';
import { DirectivesModule } from '@directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PassphraseInputComponent],
  imports: [IonicModule,
    DirectivesModule,
    TranslateModule
  ],
  exports: [PassphraseInputComponent]
})
export class PassphraseInputComponentModule { }
