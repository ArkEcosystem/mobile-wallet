import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { Wallet, WalletKeys } from '@models/model';
import { AuthProvider } from '@providers/auth/auth';
import { UserDataProvider } from '@providers/user-data/user-data';
import { ToastProvider } from '@providers/toast/toast';

import lodash from 'lodash';

@Component({
  selector: 'pin-code',
  templateUrl: 'pin-code.html'
})
export class PinCodeComponent {

  @Input('wallet') wallet: Wallet;

  @Output('onSuccess') onSuccess: EventEmitter<WalletKeys> = new EventEmitter();
  @Output('onWrong') onWrong: EventEmitter<void> = new EventEmitter();

  constructor(
    private userDataProvider: UserDataProvider,
    private authProvider: AuthProvider,
    private toastProvider: ToastProvider,
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

      let passphrases = this.userDataProvider.getKeysByWallet(this.wallet, password);

      if (lodash.isEmpty(passphrases) || lodash.isNil(passphrases)) return this.onWrong.emit();

      return this.onSuccess.emit(passphrases);
    });

    modal.present();
  }

  createUpdatePinCode(nextPage?: string, oldPassword?: string) {
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
                if (oldPassword) {
                  this.userDataProvider.updateWalletEncryption(oldPassword, password);
                }
                this.toastProvider.success(oldPassword ? 'PIN_CODE.PIN_UPDATED_TEXT' : 'PIN_CODE.PIN_CREATED_TEXT');
                if (nextPage) {
                  this.navCtrl.push(nextPage);
                }
              } else {
                this.toastProvider.error(oldPassword ? 'PIN_CODE.PIN_UPDATED_ERROR_TEXT' : 'PIN_CODE.PIN_CREATED_ERROR_TEXT');
              }
            })

            validateModal.present();
          } else {
            this.toastProvider.error(oldPassword ? 'PIN_CODE.PIN_UPDATED_ERROR_TEXT' : 'PIN_CODE.PIN_CREATED_ERROR_TEXT');
          }
        });

        createModal.present();
      } else if (nextPage) {
        this.navCtrl.push(nextPage);
      }
    }
    if (!oldPassword) {
      this.authProvider.getMasterPassword().do(createModal).subscribe();
    } else {
      createModal();
    }
  }

}
