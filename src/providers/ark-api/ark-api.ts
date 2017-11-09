import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable, Subject, BehaviorSubject } from 'rxjs';

import { UserDataProvider } from '@providers/user-data/user-data';
import { StorageProvider } from '@providers/storage/storage';

let packageJson = require('@root/package.json');
import { Transaction } from '@models/transaction';

import * as arkts from 'ark-ts';
import lodash from 'lodash';

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
    private http: Http,
  ) {
    this.userDataProvider.onActivateNetwork$.subscribe((network) => {
      if (lodash.isEmpty(network)) return;

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
    return this._fees;
  }

  public get delegates(): Observable<arkts.Delegate[]> {
    if (!lodash.isEmpty(this._delegates)) return Observable.of(this._delegates);

    return this.fetchAllDelegates();
  }

  public findGoodPeer(): void {
    // Get list from active peer
    this._api.peer.list().subscribe((response) => {
      if (response) {
        let port = this._network.activePeer.port;
        let sortHeight = lodash.orderBy(lodash.filter(response.peers, {'status': 'OK', 'port': port}), ['height','delay'], ['desc','asc']);
        this._peers = sortHeight;
        this.updateNetwork(sortHeight[0]);
      }
    },
    // Get list from file
    () => {
      return arkts.PeerApi.findGoodPeer(this._network).first().subscribe((peer) => this.updateNetwork(peer));
    });
  }

  public fetchAllDelegates(): Observable<arkts.Delegate[]> {
    if (!this._api) return;
    const limit = 51;

    let totalCount = limit;
    let offset, currentPage;
    offset = currentPage = 0;

    let totalPages = totalCount / limit;

    let delegates: arkts.Delegate[] = [];

    return Observable.create((observer) => {

      this._api.delegate.list({ limit, offset }).expand((project) => {
        let req = this._api.delegate.list({ limit, offset });
        return currentPage < totalPages ? req : Observable.empty();
      }).do((response) => {
        offset += limit;
        if (response.success) totalCount = response.totalCount;
        totalPages = Math.ceil(totalCount / limit);

        currentPage++;
      }).finally(() => {
        this.onUpdateDelegates$.next(delegates);

        observer.next(delegates);
        observer.complete();
      }).subscribe((data) => {
        if (data.success) delegates = [...delegates, ...data.delegates];
      });
    });

  }

  public createTransaction(transaction: Transaction, passphrase: string, secondPassphrase: string): Observable<Transaction> {
    return Observable.create((observer) => {
      if (!arkts.PublicKey.validateAddress(transaction.address, this._network)) {
        observer.error(`The destination address ${transaction.address} is erroneous`);
        return observer.complete();
      }

      let wallet = this.userDataProvider.getWalletByAddress(transaction.address);
      transaction.senderId = transaction.address;

      if (transaction.getAmount() > Number(wallet.balance)) {
        observer.error(`Not enough ${this._network.token} on your account`);
        return observer.complete();
      }

      transaction.signature = null;
      transaction.signSignature = null;
      transaction.id = null;

      let keys = this.arkjs.crypto.getKeys(passphrase);
      this.arkjs.crypto.sign(transaction, keys);

      if (secondPassphrase) {
        let secondKeys = this.arkjs.crypto.getKeys(secondPassphrase);
        this.arkjs.crypto.secondSign(transaction, secondKeys);
      }

      transaction.id = this.arkjs.crypto.getId(transaction);

      observer.next(transaction);
      observer.complete();
    });
  }

  public postTransaction(transaction: arkts.Transaction, peer: arkts.Peer = this._network.activePeer, broadcast: boolean = true) {
    return Observable.create((observer) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('os', 'ark-mobile');
      headers.append('version', packageJson.version);
      headers.append('port', '1');
      headers.append('nethash', this._network.nethash);

      const options = new RequestOptions({ headers });

      let url = `http://${peer.ip}:${peer.port}/peer/transactions`;
      let data = JSON.stringify({ transactions: [transaction] });
      this.http.post(url, data, options).map((resp) => resp.json()).subscribe((data: arkts.TransactionPostResponse) => {
        if (data.success) {
          this.onSendTransaction$.next(transaction);
          if (broadcast) {
            this.broadcastTransaction(transaction);
          }
          observer.next(transaction);
        } else {
          observer.error(data);
        }
      }, (error) => observer.error(error));
    });

  }

  private broadcastTransaction(transaction: arkts.Transaction) {
    let max = 10;

    for (let peer of this._peers.slice(0, max)) {
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

    this.fetchAllDelegates().subscribe((data) => {
      this._delegates = data;
    });

    this.setFees();
  }

  private setFees(): void {
    arkts.BlockApi.networkFees(this._network).subscribe((response) => {
      if (response && response.success) {
        this._fees = response.fees;
      }
    });
  }

}
