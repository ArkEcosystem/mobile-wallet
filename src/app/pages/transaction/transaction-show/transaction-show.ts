import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { Transaction } from '@/models/transaction';
import { UserDataProvider } from '@/services/user-data/user-data';
import { ContactsProvider } from '@/services/contacts/contacts';
import { Network } from 'ark-ts/model';
import { TranslateService } from '@ngx-translate/core';
import { TruncateMiddlePipe } from '@/pipes/truncate-middle/truncate-middle';
import { Wallet, StoredNetwork } from '@/models/model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-transaction-show',
  templateUrl: 'transaction-show.html',
  styleUrls: ['transaction-show.scss'],
  providers: [InAppBrowser, TruncateMiddlePipe],
})
export class TransactionShowPage {

  public transaction: Transaction;
  public equivalentAmount = 0;
  public equivalentSymbol: string;

  public showOptions = false;
  private currentNetwork: StoredNetwork;
  private currentWallet: Wallet;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private userDataProvider: UserDataProvider,
    private contactsProvider: ContactsProvider,
    private inAppBrowser: InAppBrowser,
    private actionSheetCtrl: ActionSheetController,
    private translateService: TranslateService,
    private truncateMiddlePipe: TruncateMiddlePipe,
    private platform: Platform,
  ) {
    this.currentNetwork = this.userDataProvider.currentNetwork;
    this.currentWallet = this.userDataProvider.currentWallet;
    
    const transaction = this.route.snapshot.queryParamMap.get('transaction');
    this.equivalentAmount = +this.route.snapshot.queryParamMap.get('equivalentAmount');
    this.equivalentSymbol = this.route.snapshot.queryParamMap.get('equivalentSymbol');

    if (!transaction) { this.navCtrl.pop(); }

    const transactionMap = JSON.parse(transaction);
    this.transaction = new Transaction(transactionMap.address, this.currentNetwork).deserialize(transactionMap);
    this.shouldShowOptions();
  }

  openInExplorer() {
    const url = `${this.currentNetwork.explorer}/transaction/${this.transaction.id}`;
    return this.inAppBrowser.create(url, '_system');
  }

  presentOptions() {
    const address = this.transaction.getAppropriateAddress();
    const addressTruncated = this.truncateMiddlePipe.transform(address, 10, null);
    const contact = this.contactsProvider.getContactByAddress(address);
    const contactOrAddress = contact ? contact['name'] : addressTruncated;

    this.translateService
      .get(
        [
          'TRANSACTIONS_PAGE.ADD_ADDRESS_TO_CONTACTS',
          'TRANSACTIONS_PAGE.SEND_TOKEN_TO_ADDRESS',
        ],
        { address: contactOrAddress, token: this.currentNetwork.token }
      )
      .subscribe(async (translation) => {
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

        if (this.currentWallet && !this.currentWallet.isWatchOnly) {
          buttons.push({
            text: translation['TRANSACTIONS_PAGE.SEND_TOKEN_TO_ADDRESS'],
            role: 'send',
            icon: this.platform.is('ios') ? 'ios-send-outline' : 'md-send',
            handler: () => {
              this.sendToAddress(address);
            }
          });
        }

        const action = await this.actionSheetCtrl.create({ buttons })
        action.present();
      });
  }

  addToContacts(address: string) {
    this.navCtrl.navigateForward('/contacts/create', { queryParams: {
      address
    }});
  }

  sendToAddress(address: string) {
    this.navCtrl.navigateForward('/transaction/send', { queryParams: {
      address
    }});
  }

  private shouldShowOptions() {
    if (this.transaction.isTransfer()) {
      const contact = this.contactsProvider.getContactByAddress(this.transaction.getAppropriateAddress());
      if (!contact || (this.currentWallet && !this.currentWallet.isWatchOnly)) { return this.showOptions = true; }
    }
  }

}
