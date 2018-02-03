export class PassphraseWord {
  public isUserTyped: boolean;

  public constructor(private passphraseValue, public number, public userValue?: string) {
  }

  public get hasUIError(): boolean {
    return this.isUserTyped && !this.isCorrect;
  }

  public get isCorrect(): boolean {
    return this.userValue === this.passphraseValue;
  }
}
