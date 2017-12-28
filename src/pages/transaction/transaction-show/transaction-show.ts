import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { Transaction } from '@models/transaction';
import { UserDataProvider } from '@providers/user-data/user-data';
import { Network } from 'ark-ts/model';
import { TranslateService } from '@ngx-translate/core';
import { TruncateMiddlePipe } from '@pipes/truncate-middle/truncate-middle';
import { Wallet } from '@models/model';

@IonicPage()
@Component({
  selector: 'page-transaction-show',
  templateUrl: 'transaction-show.html',
  providers: [InAppBrowser, TruncateMiddlePipe],
})
export class TransactionShowPage {

  public transaction: Transaction;
  public currentNetwork: Network;
  public equivalentAmount: number = 0;
  public equivalentSymbol: string;

  public recipientLabel: string;
  public senderLabel: string;
  public showOptions: boolean = false;

  private currentWallet: Wallet;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private userDataProvider: UserDataProvider,
    private inAppBrowser: InAppBrowser,
    private actionSheetCtrl: ActionSheetController,
    private translateService: TranslateService,
    private TruncateMiddlePipe: TruncateMiddlePipe,
    private platform: Platform,
  ) {
    let transaction = this.navParams.get('transaction');
    this.currentNetwork = this.userDataProvider.currentNetwork;
    this.currentWallet = this.userDataProvider.currentWallet;

    this.equivalentAmount = this.navParams.get('equivalentAmount');
    this.equivalentSymbol = this.navParams.get('equivalentSymbol');

    if (!transaction) this.navCtrl.popToRoot();

    this.transaction = new Transaction(transaction.address).deserialize(transaction);
    this.shouldShowOptions();
  }

  openInExplorer() {
    let url = `${this.currentNetwork.explorer}/tx/${this.transaction.id}`;
    return this.inAppBrowser.create(url);
  }

  presentOptions() {
    let address = this.transaction.getAppropriateAddress();
    let addressTruncated = this.TruncateMiddlePipe.transform(address, 10, null);
    let contact = this.userDataProvider.getContactByAddress(address);
    let contactOrAddress = contact ? contact['name'] : addressTruncated;

    this.translateService.get([
      'TRANSACTIONS_PAGE.ADD_ADDRESS_TO_CONTACTS',
      'TRANSACTIONS_PAGE.SEND_TOKEN_TO_ADDRESS',
    ], { address: contactOrAddress, token: this.currentNetwork.token }).subscribe((translation) => {
      let buttons = [];

      if (!contact) {
        buttons.push({
          text: translation['TRANSACTIONS_PAGE.ADD_ADDRESS_TO_CONTACTS'],
          role: 'contact',
          icon: this.platform.is('ios') ? '' : 'ios-person-add-outline',
          handler: () => {
            this.addToContacts(address);
          }
        });
      }

      if (!this.currentWallet.isWatchOnly) {
        buttons.push({
          text: translation['TRANSACTIONS_PAGE.SEND_TOKEN_TO_ADDRESS'],
          role: 'send',
          icon: this.platform.is('ios') ? '' : 'ios-send-outline',
          handler: () => {
            this.sendToAddress(address);
          }
        })
      }

      this.actionSheetCtrl.create({ buttons }).present();
    });
  }

  addToContacts(address: string) {
    this.navCtrl.push('ContactCreatePage', { address });
  }

  sendToAddress(address: string) {
    this.navCtrl.push('TransactionSendPage', { address })
  }

  private shouldShowOptions() {
    if (this.transaction.isTransfer()) {
      let contact = this.userDataProvider.getContactByAddress(this.transaction.getAppropriateAddress());
      if (!contact || !this.currentWallet.isWatchOnly) return this.showOptions = true;
    }
  }

}
