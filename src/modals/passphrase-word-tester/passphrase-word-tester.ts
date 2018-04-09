import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {PassphraseWord} from '@models/passphrase-word';
import { UserDataProvider } from '@providers/user-data/user-data';

@IonicPage()
@Component({
  selector: 'modal-passphrase-word-tester',
  templateUrl: 'passphrase-word-tester.html',
})
export class PassphraseWordTesterModal {

  public words: PassphraseWord[] = [];
  public isDevNet: boolean;

  public constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private userDataProvider: UserDataProvider) {
    this.words = this.navParams.get('words') as PassphraseWord[];

    if (!this.words) {
      this.dismiss();
    }

    this.isDevNet = this.userDataProvider.isDevNet;
  }

  public areAllWordsCorrect(): boolean {
    return this.words.every(w => w.isCorrect);
  }

  public next(): void {
    this.dismiss(this.areAllWordsCorrect());
  }

  public dismiss(validationSuccess?: boolean): void {
    this.viewCtrl.dismiss(validationSuccess);
  }
}
