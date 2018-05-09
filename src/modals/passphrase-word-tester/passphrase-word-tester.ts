import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {PassphraseWord} from '@models/passphrase-word';
import { UserDataProvider } from '@providers/user-data/user-data';
import bip39 from 'bip39';

@IonicPage()
@Component({
  selector: 'modal-passphrase-word-tester',
  templateUrl: 'passphrase-word-tester.html',
})
export class PassphraseWordTesterModal {

  public words: PassphraseWord[] = [];
  public isDevNet: boolean;
  public wordSuggestions = [[], [], []];

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

  wordChange(value, wordIndex) {
    this.words[wordIndex].userValue = value;
    this.suggestWord(value, wordIndex);
  }

  suggestWord(wordInput, wordIndex) {
    this.wordSuggestions = [[], [], []];
    if (wordInput.length < 2) { return; }

    const wordlist = bip39.wordlists.english;
    this.wordSuggestions[wordIndex] = wordlist.filter( word => word.indexOf(wordInput) === 0 );
  }

  suggestionClick(wordIndex, suggestionIndex) {
    this.words[wordIndex].userValue = this.wordSuggestions[wordIndex][suggestionIndex];
    this.wordSuggestions = [[], [], []];
  }
}
