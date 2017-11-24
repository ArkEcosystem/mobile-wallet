import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { Wallet, WalletPassphrases } from '@models/model';
import { AuthProvider } from '@providers/auth/auth';
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
    private authProvider: AuthProvider,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
  ) { }

  open(message: string, outputPassword: boolean) {
    if (!this.wallet) return;

    let modal = this.modalCtrl.create('PinCodeModal', {
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

  createUpdatePinCode(nextPage?: string, forceChange: boolean = false) {
    let createModal = (master?: any) => {
      if (!master) {
        let createModal = this.modalCtrl.create('PinCodeModal', {
          message: 'PIN_CODE.CREATE',
          outputPassword: true,
        });

        createModal.onDidDismiss((password) => {
          if (password) {
            let validateModal = this.modalCtrl.create('PinCodeModal', {
              message: 'PIN_CODE.CONFIRM',
              expectedPassword: password,
            });

            validateModal.onDidDismiss((status) => {
              if (status) {
                this.authProvider.saveMasterPassword(password);
                //TODO: toast success message
                if (nextPage) {
                  this.navCtrl.push(nextPage);
                }
              } else {
                // TODO: fail
              }
            })

            validateModal.present();
          } else {
            // TODO: fail
          }
        });

        createModal.present();
      } else if (nextPage) {
        this.navCtrl.push(nextPage);
      }
    }
    if (!forceChange) {
      this.authProvider.getMasterPassword().do(createModal).subscribe();
    } else {
      createModal();
    }
  }

}
