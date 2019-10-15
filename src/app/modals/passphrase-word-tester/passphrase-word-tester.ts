import {Component, ViewChild} from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { UserDataProvider } from '@/services/user-data/user-data';
import { PassphraseInputComponent } from '@/components/passphrase-input/passphrase-input';

@Component({
  selector: 'modal-passphrase-word-tester',
  templateUrl: 'passphrase-word-tester.html',
  styleUrls: ['passphrase-word-tester.scss']
})
export class PassphraseWordTesterModal {

  public passphraseReference: string;
  public passphraseInit: string;
  public wordlistLanguage: string;
  public isDevNet: boolean;

  @ViewChild('passphrase', { read: PassphraseInputComponent, static: true })
  passphraseInput: PassphraseInputComponent;

  public constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtrl: ModalController,
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
    this.modalCtrl.dismiss(validationSuccess);
  }

}
