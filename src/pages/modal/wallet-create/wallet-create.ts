import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { Wallet } from '@models/wallet';
import { UserDataProvider } from '@providers/user-data/user-data';

import { PrivateKey, Network } from 'ark-ts';
import bip39 from 'bip39';

@IonicPage()
@Component({
  selector: 'page-wallet-create',
  templateUrl: 'wallet-create.html',
  providers: [Clipboard],
})
export class WalletCreatePage {

  public account: any = {
    address: '',
    qraddress: '{a: ""}',
    entropy: '',
    mnemonic: '',
    qrpassphrase: '',
    publicKey: '',
    seed: '',
    wif: '',
  }

  public keySegment: string = 'public';

  public disableShowDetails: boolean = false;
  public showDetails: boolean = false;
  public fee: number;
  public message: string;
  public title: string;

  private currentNetwork: Network;
  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userDataProvider: UserDataProvider,
    private viewCtrl: ViewController,
    private clipboard: Clipboard,
  ) {
    this.currentNetwork = this.userDataProvider.currentNetwork;

    this.account.entropy = this.navParams.get('entropy');
    this.disableShowDetails = this.navParams.get('disableShowDetails') || false;
    this.fee = this.navParams.get('fee');
    this.message = this.navParams.get('message');
    this.title = this.navParams.get('title');

    if (!this.account.entropy) this.dismiss();
  }

  toggleShowDetails() {
    this.showDetails = !this.showDetails;
  }

  copyPassphrase() {
    this.clipboard.copy(this.account.mnemonic);
  }

  next() {
    this.dismiss(this.account);
  }

  load() {
    this.account.mnemonic = bip39.entropyToMnemonic(this.account.entropy);
    this.account.qrpassphrase = `{"passphrase": "${this.account.mnemonic}"}`;

    let privateKey = PrivateKey.fromSeed(this.account.mnemonic, this.currentNetwork);
    let publicKey = privateKey.getPublicKey();

    this.account.publicKey = publicKey.toHex();
    this.account.address = publicKey.getAddress();
    this.account.qraddress = `{"a": "${this.account.address}"}`;

    this.account.wif = privateKey.toWIF();
    this.account.seed = bip39.mnemonicToSeedHex(this.account.mnemonic);
  }

  dismiss(result?: any) {
    this.viewCtrl.dismiss(result);
  }

  ionViewDidLoad() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
