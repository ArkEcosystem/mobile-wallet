import { Injectable } from '@angular/core';

import { LocalNotifications } from '@ionic-native/local-notifications';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';
import { UserDataProvider } from '@providers/user-data/user-data';
import { UserSettings, Wallet, Transaction } from '@models/model';
import { Subject } from 'rxjs/Subject';
import { AccountLabelPipe } from '@pipes/account-label/account-label';

import * as arkts from 'ark-ts';
import lodash from 'lodash';

@Injectable()
export class LocalNotificationsProvider {

  public onNewTransaction: Subject<arkts.Transaction> = new Subject();
  private currentSettings: UserSettings;

  constructor(
    private localNotifications: LocalNotifications,
    private userDataProvider: UserDataProvider,
    private settingsDataProvider: SettingsDataProvider,
    private accountLabelPipe: AccountLabelPipe,
  ) {
    this.settingsDataProvider.settings.subscribe(settings => {
      this.currentSettings = settings;

      // if (settings.notification) {
      this.watch();
      // }
    });
  }

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

  private notifyTransaction (transactions: Transaction[], wallet: any) {
    for (const transaction of transactions) {
      if (!transaction.isTransfer()) {
        return;
      }

      const username = this.accountLabelPipe.transform(transaction.address, null);
      const title = `New transaction in ${wallet.profileName}`;
      const text = `${username} ${transaction.getActivityLabel()} ${transaction.getAppropriateAddress()}`;

      this.localNotifications.schedule({
        title,
        text,
      });
    }
  }

  private watch () {
    if (lodash.isEmpty(this.userDataProvider.profiles)) {
      return;
    }

    const wallets = this.getAllWallets();

    this.watchTransactions(wallets);
  }

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
}
