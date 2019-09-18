import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { UserDataProvider } from '@providers/user-data/user-data';
import { PassphraseInputComponent } from '@components/passphrase-input/passphrase-input';

@IonicPage()
@Component({
  selector: 'modal-passphrase-word-tester',
  templateUrl: 'passphrase-word-tester.html',
})
export class PassphraseWordTesterModal {

  public passphraseReference: string;
  public passphraseInit: string;
  public wordlistLanguage: string;
  public isDevNet: boolean;

  @ViewChild(PassphraseInputComponent) passphraseInput: PassphraseInputComponent;

  public constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private userDataProvider: UserDataProvider) {
    this.passphraseReference = this.navParams.get('passphrase');
    this.wordlistLanguage = this.navParams.get('wordlistLanguage') || 'english';

    if (!this.passphraseReference) {
      this.dismiss();
    }

    this.isDevNet = this.userDataProvider.isDevNet;
    if (this.isDevNet) {
      this.passphraseInit = this.passphraseReference;
    }
  }

  public areAllWordsCorrect(): boolean {
    return this.passphraseInput.validatePassphrase(this.passphraseReference);
  }

  public next(): void {
    this.dismiss(this.areAllWordsCorrect());
  }

  public dismiss(validationSuccess?: boolean): void {
    this.viewCtrl.dismiss(validationSuccess);
  }

}
