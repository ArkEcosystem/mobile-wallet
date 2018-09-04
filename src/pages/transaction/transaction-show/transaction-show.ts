import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { Transaction } from '@models/transaction';
import { UserDataProvider } from '@providers/user-data/user-data';
import { ContactsProvider } from '@providers/contacts/contacts';
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
  public equivalentAmount = 0;
  public equivalentSymbol: string;

  public showOptions = false;

  private currentWallet: Wallet;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private userDataProvider: UserDataProvider,
    private contactsProvider: ContactsProvider,
    private inAppBrowser: InAppBrowser,
    private actionSheetCtrl: ActionSheetController,
    private translateService: TranslateService,
    private truncateMiddlePipe: TruncateMiddlePipe,
    private platform: Platform,
  ) {
    const transaction = this.navParams.get('transaction');
    this.currentNetwork = this.userDataProvider.currentNetwork;
    this.currentWallet = this.userDataProvider.currentWallet;

    this.equivalentAmount = this.navParams.get('equivalentAmount');
    this.equivalentSymbol = this.navParams.get('equivalentSymbol');

    if (!transaction) { this.navCtrl.popToRoot(); }

    this.transaction = new Transaction(transaction.address).deserialize(transaction);
    this.shouldShowOptions();
  }

  openInExplorer() {
    const url = `${this.currentNetwork.explorer}/tx/${this.transaction.id}`;
    return this.inAppBrowser.create(url, '_system');
  }

  presentOptions() {
    const address = this.transaction.getAppropriateAddress();
    const addressTruncated = this.truncateMiddlePipe.transform(address, 10, null);
    const contact = this.contactsProvider.getContactByAddress(address);
    const contactOrAddress = contact ? contact['name'] : addressTruncated;

    this.translateService.get([
      'TRANSACTIONS_PAGE.ADD_ADDRESS_TO_CONTACTS',
      'TRANSACTIONS_PAGE.SEND_TOKEN_TO_ADDRESS',
    ], { address: contactOrAddress, token: this.currentNetwork.token }).subscribe((translation) => {
      const buttons = [];

      if (!contact) {
        buttons.push({
          text: translation['TRANSACTIONS_PAGE.ADD_ADDRESS_TO_CONTACTS'],
          role: 'contact',
          icon: this.platform.is('ios') ? 'ios-person-add-outline' : 'md-person-add',
          handler: () => {
            this.addToContacts(address);
          }
        });
      }

      if (!this.currentWallet.isWatchOnly) {
        buttons.push({
          text: translation['TRANSACTIONS_PAGE.SEND_TOKEN_TO_ADDRESS'],
          role: 'send',
          icon: this.platform.is('ios') ? 'ios-send-outline' : 'md-send',
          handler: () => {
            this.sendToAddress(address);
          }
        });
      }

      this.actionSheetCtrl.create({ buttons }).present();
    });
  }

  addToContacts(address: string) {
    this.navCtrl.push('ContactCreatePage', { address });
  }

  sendToAddress(address: string) {
    this.navCtrl.push('TransactionSendPage', { address });
  }

  private shouldShowOptions() {
    if (this.transaction.isTransfer()) {
      const contact = this.contactsProvider.getContactByAddress(this.transaction.getAppropriateAddress());
      if (!contact || !this.currentWallet.isWatchOnly) { return this.showOptions = true; }
    }
  }

}
