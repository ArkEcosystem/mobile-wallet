import { Injectable } from '@angular/core';

import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';

import { SettingsDataProvider } from '@providers/settings-data/settings-data';
import { UserDataProvider } from '@providers/user-data/user-data';
import { ContactsProvider } from '@providers/contacts/contacts';
import { UserSettings, Wallet, Transaction } from '@models/model';
import { TranslateService } from '@ngx-translate/core';

import * as arkts from 'ark-ts';
import lodash from 'lodash';
import stringHash from 'string-hash';

@Injectable()
export class LocalNotificationsProvider {

  private intervalListener;

  constructor(
    private localNotifications: LocalNotifications,
    private userDataProvider: UserDataProvider,
    private contactsProvider: ContactsProvider,
    private settingsDataProvider: SettingsDataProvider,
    private translateService: TranslateService,
    private backgroundMode: BackgroundMode,
  ) { }

  // Start provider
  public init () {
    this.backgroundMode.setDefaults({ silent: true });
    this.backgroundMode.on('activate').subscribe(() => this.backgroundMode.disableWebViewOptimizations());

    this.settingsDataProvider.settings.subscribe(settings => this.prepare(settings));
    this.settingsDataProvider.onUpdate$.subscribe(settings => this.prepare(settings)); // Watch for updates
  }

  // Check the settings, configure background mode and start/stop the main task
  private prepare(settings: UserSettings) {
    if (settings.notification && !this.intervalListener) {
      this.backgroundMode.enable();
      this.checkPermission().then(() => {
        this.watch();
        this.intervalListener = setInterval(() => this.watch(), 60000);
      });
    } else if (!settings.notification && this.intervalListener) {
      this.backgroundMode.disable();
      clearInterval(this.intervalListener);
    }
  }

  // Make sure the app is allowed to show notifications
  private checkPermission () {
    return new Promise((resolve, reject) => {
      this.localNotifications.hasPermission().then(status => {
        if (status) {
          resolve();
        } else {
          this.localNotifications.requestPermission().then(res => {
            if (res) {
              resolve();
            }
          });
        }
      });
    });
  }

  // Scan each wallet and find new transactions
  watchTransactions (wallets: any) {
    for (const address in wallets) {
      const wallet = wallets[address];
      // Convert object to class
      const network = new arkts.Network();
      Object.assign(network, wallet.network);

      // Request list of transactions in the specific network
      const client = new arkts.Client(network);
      client.transaction.list({ senderId: address, recipientId: address })
        .subscribe(response => {
          if (!response.success) {
            return;
          }

          if (Number(response.count) > wallet.transactions.length) {
            const localLength = wallet.transactions.length;

            // Update transactions in the wallet
            const w = new Wallet();
            Object.assign(w, wallet);

            w.loadTransactions(response.transactions);

            this.userDataProvider.saveWallet(w, wallet.profileId);

            // Get only the new transaction and notify the user
            const newTransactions = lodash.drop(w.transactions, localLength);
            this.notifyTransaction(newTransactions, wallet);
          }
        });
    }
  }

  // Notify each new transaction
  private notifyTransaction (transactions: Transaction[], wallet: any) {
    const notifications = [];

    for (const transaction of transactions) {
      if (!transaction.isTransfer()) {
        return;
      }

      const activityLabel = transaction.getActivityLabel();
      this.translateService.get([
        activityLabel,
        'WALLETS_PAGE.NEW_TRANSACTION'
      ], { profile: wallet.profileName }).subscribe((translation: String[]) => {
        const username = this.getAccountLabel(transaction.address, wallet.profileId);
        const recipientLabel = this.getAccountLabel(transaction.getAppropriateAddress(), wallet.profileId);

        const title = `💸 ${translation['WALLETS_PAGE.NEW_TRANSACTION']}`;
        const text = `${username} ${translation[activityLabel].toLowerCase()} ${recipientLabel}`;

        notifications.push({
          id: stringHash(transaction.id),
          title,
          text,
        });
      });
    }

    this.localNotifications.schedule(notifications);
    this.backgroundMode.wakeUp();
  }

  // Watch all tasks
  private watch () {
    if (lodash.isEmpty(this.userDataProvider.profiles)) {
      return;
    }

    const wallets = this.getAllWallets();

    this.watchTransactions(wallets);
  }

  // Transform profile list into unique wallets list
  private getAllWallets() {
    return lodash.transform(this.userDataProvider.profiles, (acc, value: any, key) => {

      for (const address in value.wallets) {
        const info = value.wallets[address];
        info.profileName = value.name;
        info.profileId = key;
        info.network = this.userDataProvider.getNetworkById(value.networkId);
        acc[address] = info;
      }

      return acc;
    }, {});
  }

  // The pipe is not working properly
  private getAccountLabel(address: string, profileId: string) {
    const contact = this.contactsProvider.getContactByAddress(address, profileId);
    if (contact) { return contact.name; }

    const label = this.userDataProvider.getWalletLabel(address, profileId);
    if (label) { return label; }

    return address;
  }
}
