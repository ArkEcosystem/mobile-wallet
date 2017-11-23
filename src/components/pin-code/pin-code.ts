import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { Wallet, WalletPassphrases } from '@models/model';
import { UserDataProvider } from '@providers/user-data/user-data';

import lodash from 'lodash';

@Component({
  selector: 'pin-code',
  templateUrl: 'pin-code.html'
})
export class PinCodeComponent {

  @Input('wallet') wallet: Wallet;

  @Output('onSuccess') onSuccess: EventEmitter<WalletPassphrases> = new EventEmitter();
  @Output('onWrong') onWrong: EventEmitter<void> = new EventEmitter();

  constructor(
    private userDataProvider: UserDataProvider,
    private modalController: ModalController,
  ) { }

  open(message: string, outputPassword: boolean) {
    if (!this.wallet) return;

    let modal = this.modalController.create('PinCodeModal', {
      message,
      outputPassword,
      validatePassword: true,
    });

    modal.onDidDismiss((password) => {
      if (lodash.isNil(password)) return this.onWrong.emit();

      if (!outputPassword) return this.onSuccess.emit();

      let passphrases = this.userDataProvider.getPassphrasesByWallet(this.wallet, password);

      if (lodash.isEmpty(passphrases) || lodash.isNil(passphrases)) return this.onWrong.emit();

      return this.onSuccess.emit(passphrases);
    });

    modal.present();
  }

}
