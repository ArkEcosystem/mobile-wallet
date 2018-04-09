import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalController, NavController, LoadingController } from 'ionic-angular';
import { Wallet, WalletKeys } from '@models/model';
import { AuthProvider } from '@providers/auth/auth';
import { UserDataProvider } from '@providers/user-data/user-data';
import { ToastProvider } from '@providers/toast/toast';

import lodash from 'lodash';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'pin-code',
  templateUrl: 'pin-code.html'
})
export class PinCodeComponent {

  @Input('wallet') wallet: Wallet;

  @Output('onSuccess') onSuccess: EventEmitter<WalletKeys> = new EventEmitter();
  @Output('onWrong') onWrong: EventEmitter<void> = new EventEmitter();
  @Output('onClosed') onClosed: EventEmitter<void> = new EventEmitter();

  constructor(
    private userDataProvider: UserDataProvider,
    private authProvider: AuthProvider,
    private toastProvider: ToastProvider,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private translateService: TranslateService
  ) {
  }

  open(message: string, outputPassword: boolean, verifySecondPassphrase: boolean = false, onSuccess?: (keys: WalletKeys) => void) {
    if (outputPassword && !this.wallet) { return false; }

    const modal = this.modalCtrl.create('PinCodeModal', {
      message,
      outputPassword,
      validatePassword: true,
    });

    modal.onDidDismiss((password) => {
      if (lodash.isNil(password)) { return this.onClosed.emit(); }

      const loader = this.loadingCtrl.create({
        dismissOnPageChange: true,
        enableBackdropDismiss: false,
        showBackdrop: true
      });

      loader.present();

      if (!outputPassword) {
        loader.dismiss();
        return this.executeOnSuccess(onSuccess);
      }

      const passphrases = this.userDataProvider.getKeysByWallet(this.wallet, password);
      loader.dismiss();

      if (lodash.isEmpty(passphrases) || lodash.isNil(passphrases)) { return this.onWrong.emit(); }

      if (verifySecondPassphrase) { return this.requestSecondPassphrase(passphrases, onSuccess); }
      return this.executeOnSuccess(onSuccess, passphrases);
    });

    modal.present();
  }

  private requestSecondPassphrase(passphrases: WalletKeys, onSuccess: (keys: WalletKeys) => void) {
    if (this.wallet.secondSignature && !this.wallet.cipherSecondKey) {
      const modal = this.modalCtrl.create('EnterSecondPassphraseModal', null, { cssClass: 'inset-modal' });

      modal.onDidDismiss((passphrase) => {
        if (!passphrase) {
          this.toastProvider.error('TRANSACTIONS_PAGE.SECOND_PASSPHRASE_NOT_ENTERED');
          return this.onWrong.emit();
        }

        passphrases.secondPassphrase = passphrase;
        return this.executeOnSuccess(onSuccess, passphrases);
      });

      modal.present();
    } else {
      return this.executeOnSuccess(onSuccess, passphrases);
    }
  }

  createUpdatePinCode(nextPage?: string, oldPassword?: string) {
    const createPinCodeModalFunc = (master?: any) => {
      if (!master) {
        const pinCodeModal = this.modalCtrl.create('PinCodeModal', {
          message: 'PIN_CODE.CREATE',
          outputPassword: true,
        });

        pinCodeModal.onDidDismiss((password) => {
          if (password) {
            const validateModal = this.modalCtrl.create('PinCodeModal', {
              message: 'PIN_CODE.CONFIRM',
              expectedPassword: password,
            });

            validateModal.onDidDismiss((status) => {
              const continueWithSuccess = (successMessageKey: string) => {
                this.toastProvider.success(successMessageKey);
                if (nextPage) {
                  this.navCtrl.push(nextPage);
                }
              };

              if (status) {
                this.authProvider.saveMasterPassword(password);
                if (oldPassword) {
                  this.translateService.get('PIN_CODE.UPDATING').subscribe(updatingText => {
                    const loading = this.loadingCtrl.create({content: updatingText});
                    loading.present()
                      .then(() => {
                        this.userDataProvider.updateWalletEncryption(oldPassword, password);
                        loading.dismiss();
                        continueWithSuccess('PIN_CODE.PIN_UPDATED_TEXT');
                      });
                  });
                } else {
                  continueWithSuccess('PIN_CODE.PIN_CREATED_TEXT');
                }
              } else {
                this.toastProvider.error(oldPassword ? 'PIN_CODE.PIN_UPDATED_ERROR_TEXT' : 'PIN_CODE.PIN_CREATED_ERROR_TEXT');
              }
            });

            validateModal.present();
          } else {
            this.toastProvider.error(oldPassword ? 'PIN_CODE.PIN_UPDATED_ERROR_TEXT' : 'PIN_CODE.PIN_CREATED_ERROR_TEXT');
          }
        });

        pinCodeModal.present();
      } else if (nextPage) {
        this.navCtrl.push(nextPage);
      }
    };
    if (!oldPassword) {
      this.authProvider.getMasterPassword().do(createPinCodeModalFunc).subscribe();
    } else {
      createPinCodeModalFunc();
    }
  }

  private executeOnSuccess(onSuccess: (keys: WalletKeys) => any, keys?: WalletKeys): void {
    if (onSuccess) {
      onSuccess(keys);
    }
    return this.onSuccess.emit(keys);
  }
}
