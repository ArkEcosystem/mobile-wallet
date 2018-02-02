import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/expand';

import { UserDataProvider } from '@providers/user-data/user-data';
import { StorageProvider } from '@providers/storage/storage';
import { ToastProvider } from '@providers/toast/toast';

const packageJson = require('@root/package.json');
import { Transaction, TranslatableObject } from '@models/model';

import * as arkts from 'ark-ts';
import lodash from 'lodash';
import * as constants from '@app/app.constants';
import arktsConfig from 'ark-ts/config';
import { ArkUtility } from '../../utils/ark-utility';

@Injectable()
export class ArkApiProvider {

  public onUpdatePeer$: Subject<arkts.Peer> = new Subject<arkts.Peer>();
  public onUpdateDelegates$: Subject<arkts.Delegate[]> = new Subject<arkts.Delegate[]>();
  public onSendTransaction$: Subject<arkts.Transaction> = new Subject<arkts.Transaction>();

  private _network: arkts.Network;
  private _api: arkts.Client;

  private _fees: arkts.Fees;
  private _delegates: arkts.Delegate[];
  private _peers: arkts.Peer[];

  public arkjs = require('arkjs');

  constructor(
    private userDataProvider: UserDataProvider,
    private storageProvider: StorageProvider,
    private toastProvider: ToastProvider,
    private http: HttpClient) {
    this.loadData();

    this.userDataProvider.onActivateNetwork$.subscribe((network) => {
      if (lodash.isEmpty(network)) { return; }

      // set default peer
      if (network && !network.activePeer) {
        network.activePeer = arkts.Network.getDefault(network.type).activePeer;
      }

      this._network = network;
      this.arkjs.crypto.setNetworkVersion(this._network.version);

      this._api = new arkts.Client(this._network);
      this.findGoodPeer();
    });
  }

  public get network() {
    return this._network;
  }

  public get api() {
    return this._api;
  }

  public get fees() {
    if (!lodash.isUndefined(this._fees)) { return Observable.of(this._fees); }

    return this.fetchFees();
  }

  public get delegates(): Observable<arkts.Delegate[]> {
    if (!lodash.isEmpty(this._delegates)) { return Observable.of(this._delegates); }

    return this.fetchDelegates(constants.NUM_ACTIVE_DELEGATES * 2);
  }

  public findGoodPeer(): void {
    // Get list from active peer
    this._api.peer.list().subscribe((response) => {
      if (response) {
        const port = +this._network.activePeer.port;
        const filteredPeers = lodash.filter(response.peers, (peer) => {
          return peer['status'] === 'OK' && peer['port'] === port && peer.ip !== this._network.activePeer.ip && peer.ip !== '127.0.0.1';
        });
        const sortHeight = lodash.orderBy(filteredPeers, ['height', 'delay'], ['desc', 'asc']);
        this._peers = sortHeight;
        this.updateNetwork(sortHeight[0]);
      } else {
        this.toastProvider.error('API.PEER_LIST_ERROR');
      }
    },
    // Get list from file
    () => {
      return arkts.PeerApi
        .findGoodPeer(this._network)
        .subscribe((peer) => this.updateNetwork(peer), () => {
          this.toastProvider.error('API.PEER_LIST_ERROR');
        });
    });
  }

  public fetchDelegates(numberDelegatesToGet: number, getAllDelegates = false): Observable<arkts.Delegate[]> {
    if (!this._api) { return; }
    const limit = 51;

    const totalCount = limit;
    let offset, currentPage;
    offset = currentPage = 0;

    let totalPages = totalCount / limit;

    let delegates: arkts.Delegate[] = [];

    return Observable.create((observer) => {

      this._api.delegate.list({ limit, offset }).expand(() => {
        const req = this._api.delegate.list({ limit, offset });
        return currentPage < totalPages ? req : Observable.empty();
      }).do((response) => {
        offset += limit;
        if (response.success && getAllDelegates) { numberDelegatesToGet = response.totalCount; }
        totalPages = Math.ceil(numberDelegatesToGet / limit);
        currentPage++;
      }).finally(() => {
        this.storageProvider.set(constants.STORAGE_DELEGATES, delegates);
        this.onUpdateDelegates$.next(delegates);

        observer.next(delegates);
        observer.complete();
      }).subscribe((data) => {
        if (data.success) { delegates = [...delegates, ...data.delegates]; }
      });
    });

  }

  public createTransaction(transaction: Transaction, key: string, secondKey: string, secondPassphrase: string): Observable<Transaction> {
    return Observable.create((observer) => {
      const configNetwork = arktsConfig.networks[this._network.name];
      const jsNetwork = {
        messagePrefix: configNetwork.name,
        bip32: configNetwork.bip32,
        pubKeyHash: configNetwork.version,
        wif: configNetwork.wif,
      };

      if (!arkts.PublicKey.validateAddress(transaction.address, this._network)) {
        observer.error({
          key: 'API.DESTINATION_ADDRESS_ERROR',
          parameters: {address: transaction.address}
        } as TranslatableObject);
        return observer.complete();
      }

      const wallet = this.userDataProvider.getWalletByAddress(transaction.address);
      transaction.senderId = transaction.address;

      const totalAmount = transaction.getAmount();
      const balance = Number(wallet.balance);
      if (totalAmount > balance) {
        this.toastProvider.error('API.BALANCE_TOO_LOW');
        observer.error({
          key: 'API.BALANCE_TOO_LOW_DETAIL',
          parameters: {
            token: this._network.token,
            fee: ArkUtility.arktoshiToArk(transaction.fee),
            amount: ArkUtility.arktoshiToArk(transaction.amount),
            totalAmount: ArkUtility.arktoshiToArk(totalAmount),
            balance: ArkUtility.arktoshiToArk(balance)
          }
        } as TranslatableObject);
        return observer.complete();
      }

      transaction.signature = null;
      transaction.signSignature = null;
      transaction.id = null;

      const keys = this.arkjs.crypto.getKeys(key, jsNetwork);
      this.arkjs.crypto.sign(transaction, keys);

      secondPassphrase = secondKey || secondPassphrase;

      if (secondPassphrase) {
        const secondKeys = this.arkjs.crypto.getKeys(secondPassphrase, jsNetwork);
        this.arkjs.crypto.secondSign(transaction, secondKeys);
      }

      transaction.id = this.arkjs.crypto.getId(transaction);

      observer.next(transaction);
      observer.complete();
    });
  }

  public postTransaction(transaction: arkts.Transaction, peer: arkts.Peer = this._network.activePeer, broadcast: boolean = true) {
    return Observable.create((observer) => {
      let headers = new HttpHeaders().set('Content-Type', 'application/json');
      headers = headers.append('os', 'ark-mobile');
      headers = headers.append('version', packageJson.version);
      headers = headers.append('port', '1');
      headers = headers.append('nethash', this._network.nethash);

      const url = `http://${peer.ip}:${peer.port}/peer/transactions`;
      const data = JSON.stringify({ transactions: [transaction] });
      this.http.post(url, data, { headers }).subscribe((result: arkts.TransactionPostResponse) => {
        if (result.success) {
          this.onSendTransaction$.next(transaction);
          if (broadcast) {
            this.broadcastTransaction(transaction);
            this.toastProvider.success('API.TRANSACTION_SENT');
          }
          observer.next(transaction);
        } else {
          if (broadcast) {
            this.toastProvider.error('API.TRANSACTION_FAILED');
          }
          observer.error(result);
        }
      }, (error) => observer.error(error));
    });

  }

  private broadcastTransaction(transaction: arkts.Transaction) {
    const max = 10;

    for (const peer of this._peers.slice(0, max)) {
      this.postTransaction(transaction, peer, false).subscribe();
    }
  }

  private updateNetwork(peer?: arkts.Peer): void {
    if (peer) {
      this._network.setPeer(peer);
      this.onUpdatePeer$.next(peer);
    }
    // Save in localStorage
    this.userDataProvider.updateNetwork(this.userDataProvider.currentProfile.networkId, this._network);
    this._api = new arkts.Client(this._network);

    this.fetchDelegates(constants.NUM_ACTIVE_DELEGATES * 2).subscribe((data) => {
      this._delegates = data;
    });

    this.fetchFees().subscribe();
  }

  private fetchFees(): Observable<arkts.Fees> {
    return Observable.create((observer) => {
      arkts.BlockApi.networkFees(this._network).subscribe((response) => {
        if (response && response.success) {
          this._fees = response.fees;
          this.storageProvider.set(constants.STORAGE_FEES, this._fees);

          observer.next(this._fees);
        }
      }, () => {
        observer.next(this.storageProvider.getObject(constants.STORAGE_FEES));
      });
    });
  }

  private loadData() {
    this.storageProvider.getObject(constants.STORAGE_DELEGATES).subscribe((delegates) => this._delegates = delegates);
  }

}
