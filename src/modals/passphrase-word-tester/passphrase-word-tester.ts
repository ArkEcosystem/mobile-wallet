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
  public wordSuggestions = [];
  public currentWordIndex = 0;

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

  wordChange(value) {
    this.words[this.currentWordIndex].userValue = value;
    this.suggestWord(value);
    if (this.words[this.currentWordIndex].isCorrect) {
      this.currentWordIndex += this.currentWordIndex < this.words.length - 1 ? 1 : 0;
      this.wordSuggestions = [];
    }
  }

  suggestWord(wordInput) {
    this.wordSuggestions = [];
    if (wordInput.length < 2) { return; }

    const wordlist = bip39.wordlists.english;
    this.wordSuggestions = wordlist.filter( word => word.indexOf(wordInput) === 0 );
  }

  suggestionClick(suggestionIndex) {
    this.words[this.currentWordIndex].userValue = this.wordSuggestions[suggestionIndex];
    this.wordSuggestions = [];
    if (this.words[this.currentWordIndex].isCorrect) { this.currentWordIndex += this.currentWordIndex < this.words.length - 1 ? 1 : 0; }
  }
}
