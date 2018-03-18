import { ModalController, NavController, NavParams } from 'ionic-angular';
import { UserDataProvider } from '@providers/user-data/user-data';
import { ArkApiProvider } from '@providers/ark-api/ark-api';
import { ToastProvider } from '@providers/toast/toast';
import { PrivateKey, PublicKey } from 'ark-ts';
import { Wallet } from '@models/model';
import { NetworkProvider } from '@providers/network/network';

export abstract class BaseWalletImport {

  public existingAddress: string;

  constructor(
    navParams: NavParams,
    protected navCtrl: NavController,
    private userDataProvider: UserDataProvider,
    private arkApiProvider: ArkApiProvider,
    protected toastProvider: ToastProvider,
    private modalCtrl: ModalController,
    private networkProvider: NetworkProvider
  ) {
    this.existingAddress = navParams.get('address');
  }

  protected import(address?: string, passphrase?: string, checkBIP39Passphrase?: boolean): void {
    let privateKey;
    let publicKey;
    const bip39 = require('bip39');

    if (address) {
      if (!this.networkProvider.isValidAddress(address)) {
        this.toastProvider.error('WALLETS_PAGE.IMPORT_INVALID_ADDRESS');
        return;
      }
      publicKey = PublicKey.fromAddress(address);
      publicKey.setNetwork(this.networkProvider.currentNetwork);
    } else {
      // test: import from passphrase here
      if (checkBIP39Passphrase && !bip39.validateMnemonic(passphrase)) {
        // passphrase is not a valid BIP39 mnemonic
        this.toastProvider.error('WALLETS_PAGE.PASSPHRASE_NOT_BIP39');
        return;
      }
      privateKey = PrivateKey.fromSeed(passphrase, this.networkProvider.currentNetwork);
      publicKey = privateKey.getPublicKey();
      address = publicKey.getAddress();
    }

    if (this.existingAddress && address !== this.existingAddress) {
      this.toastProvider.error({ key: 'WALLETS_PAGE.PASSPHRASE_NOT_BELONG_TO_ADDRESS', parameters: {address: this.existingAddress}}, 4000);
      return;
    }

    if (!publicKey) { return; }

    let newWallet = new Wallet(!privateKey);

    this.arkApiProvider.api.account
      .get({ address })
      .finally(() => {
        if (!privateKey) {
          this.addWallet(newWallet);
        } else {
          this.verifyWithPinCode(newWallet, passphrase);
        }
      })
      .subscribe((response) => {
        if (response && response.success) {
          const account = response.account;

          newWallet = newWallet.deserialize(account);
        } else {
          newWallet.address = address;
          newWallet.publicKey = publicKey.toHex();
        }
      }, () => {
        // Empty wallet
        newWallet.address = address;
        newWallet.publicKey = publicKey.toHex();
      });
  }

  private verifyWithPinCode(newWallet: Wallet, passphrase: string): void {
    const modal = this.modalCtrl.create('PinCodeModal', {
      message: 'PIN_CODE.TYPE_PIN_ENCRYPT_PASSPHRASE',
      outputPassword: true,
      validatePassword: true,
    });

    modal.onDidDismiss((password) => {
      if (password) {
        this.addWallet(newWallet, passphrase, password);
      } else {
        this.toastProvider.error('WALLETS_PAGE.ADD_WALLET_ERROR');
      }
    });

    modal.present();
  }

  private addWallet(newWallet: Wallet, passphrase?: string, password?: string): void {
    this.userDataProvider.addWallet(newWallet, passphrase, password).subscribe(() => {
      this.navCtrl.push('WalletDashboardPage', {address: newWallet.address})
        .then(() => {
          this.navCtrl.remove(this.navCtrl.getActive().index - 1, 1).then(() => {
            this.navCtrl.remove(this.navCtrl.getActive().index - 1, 1);
          });
        });
    });
  }
}
