import { Injectable, NgZone } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/expand';

import { UserDataProvider } from '@providers/user-data/user-data';
import { StorageProvider } from '@providers/storage/storage';
import { ToastProvider } from '@providers/toast/toast';
import { HttpUtils } from '@root/src/utils/http-utils';

import {Transaction, TranslatableObject, BlocksEpochResponse, Wallet} from '@models/model';

import * as arkts from 'ark-ts';
import lodash from 'lodash';
import moment from 'moment';
import * as constants from '@app/app.constants';
import arktsConfig from 'ark-ts/config';
import { ArkUtility } from '../../utils/ark-utility';
import {AccountResponse, Delegate, PeerResponse} from 'ark-ts';
import { StoredNetwork, FeeStatistic } from '@models/stored-network';
import ArkClient, { PeerApiResponse } from '../../utils/ark-client';
import * as ArkCrypto from '@arkecosystem/crypto';
import { PeerDiscovery } from '@utils/ark-peer-discovery';

interface NodeFees {
  type: number;
  min: number;
  max: number;
  avg: number;
}

interface NodeFeesResponse {
  data: NodeFees[];
}

interface NodeConfigurationConstants {
  vendorFieldLength?: number;
  activeDelegates?: number;
  epoch?: Date;
}

interface NodeConfigurationResponse {
  data: {
    feeStatistics: FeeStatistic[],
    constants: NodeConfigurationConstants
  };
}

@Injectable()
export class ArkApiProvider {

  public onUpdatePeer$: Subject<arkts.Peer> = new Subject<arkts.Peer>();
  public onUpdateDelegates$: Subject<arkts.Delegate[]> = new Subject<arkts.Delegate[]>();
  public onSendTransaction$: Subject<arkts.Transaction> = new Subject<arkts.Transaction>();
  public onUpdateTopWallets$: Subject<Wallet[]> = new Subject<Wallet[]>();

  private _network: StoredNetwork;
  private _api: arkts.Client;
  private _client: ArkClient;
  private _peerDiscovery: PeerDiscovery;

  private _fees: arkts.Fees;
  private _delegates: arkts.Delegate[];

  public arkjs = require('arkjs');

  constructor(
    private httpClient: HttpClient,
    private zone: NgZone,
    private userDataProvider: UserDataProvider,
    private storageProvider: StorageProvider,
    private toastProvider: ToastProvider) {
    this.loadData();

    this.userDataProvider.onActivateNetwork$.subscribe((network) => {

      if (lodash.isEmpty(network)) { return; }

      this.setNetwork(network);
    });
  }

  public get network() {
    return this._network;
  }

  public get client() {
    return this._client;
  }

  public get transactionBuilder() {
    return this._api.transaction;
  }

  public get feeStatistics () {
    if (!lodash.isUndefined(this._network.feeStatistics)) { return Observable.of(this._network.feeStatistics); }

    return this.fetchFeeStatistics();
  }

  public get fees() {
    if (!lodash.isUndefined(this._fees)) { return Observable.of(this._fees); }

    return this.fetchFees();
  }

  public get delegates(): Observable<arkts.Delegate[]> {
    if (!lodash.isEmpty(this._delegates)) { return Observable.of(this._delegates); }

    return this.fetchDelegates(this._network.activeDelegates * 2);
  }

  public get topWallets(): Observable<Wallet[]> {
    return this.fetchTopWallets(constants.TOP_WALLETS_TO_FETCH);
  }

  public setNetwork(network: StoredNetwork) {
    // set default peer
    if (network.type !== null) {
      const activePeer = network.activePeer;
      const apiNetwork = arkts.Network.getDefault(network.type);
      if (apiNetwork) {
        network = Object.assign<StoredNetwork, arkts.Network>(network, apiNetwork);
      }
      if (activePeer) {
        network.activePeer = activePeer;
      }
    }
    this._delegates = [];

    this._network = network;
    this.arkjs.crypto.setNetworkVersion(this._network.version);

    this._api = new arkts.Client(this._network);
    this._client = new ArkClient(this.network.getPeerAPIUrl(), this.httpClient);
    this._peerDiscovery = new PeerDiscovery(this.httpClient);
    this.connectToRandomPeer();

    // Fallback if the fetchEpoch fail
    this._network.epoch = arktsConfig.blockchain.date;
    // Fallback if the fetchNodeConfiguration fail
    this._network.activeDelegates = constants.NUM_ACTIVE_DELEGATES;
    this.userDataProvider.onUpdateNetwork$.next(this._network);

    this.fetchFees().subscribe();
  }

  private async refreshPeers(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const network = this._network;
      const networkLookup = ['mainnet', 'devnet'];

      let peerDiscovery = null;

      try {
        if (lodash.includes(networkLookup, network.name)) {
          peerDiscovery = await this._peerDiscovery.find({
            networkOrHost: network.name
          });
        } else {
          const peerUrl = network.getPeerAPIUrl();
          peerDiscovery = await this._peerDiscovery.find({
            networkOrHost: `${peerUrl}/api/peers`
          });
        }

        peerDiscovery
          .withLatency(300)
          .sortBy('latency', 'asc');

        let peers = await peerDiscovery.findPeersWithPlugin('core-api', {
          additional: [
            'height',
            'latency',
            'version'
          ]
        });

        if (!peers.length) {
          peers = await peerDiscovery
            .findPeersWithPlugin('core-wallet-api', {
              additional: [
                'height',
                'latency',
                'version'
              ]
            });
        }

        if (peers.length) {
          this._network.peerList = peers;
          resolve();
        } else {
          reject();
        }
      } catch (e) {
        reject();
      }
    });
  }

  public async connectToRandomPeer() {
    await this.refreshPeers();
    this.updateNetwork(this._network.peerList[lodash.random(this._network.peerList.length - 1)]);
  }

  public fetchDelegates(numberDelegatesToGet: number, getAllDelegates = false): Observable<arkts.Delegate[]> {
    if (!this._api) { return; }
    const limit = this._network.activeDelegates;

    const totalCount = limit;
    let page = 1;

    let totalPages = totalCount / limit;

    let delegates: arkts.Delegate[] = [];

    return Observable.create((observer) => {

      this.client.getDelegateList({ limit, page }).expand(() => {
        const next = this.client.getDelegateList({ limit, page });
        return (page - 1) < totalPages ? next : Observable.empty();
      }).do((response) => {
        if (response.success && getAllDelegates) { numberDelegatesToGet = response.totalCount; }
        totalPages = Math.ceil(numberDelegatesToGet / limit);
        page++;
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

  fetchTopWallets(numberWalletsToGet: number, page?: number): Observable<Wallet[]> {
    if (!this._network || !this._network.isV2) {
      return Observable.empty();
    }

    let topWallets: Wallet[] = [];

    const queryParams: HttpParams = HttpUtils.buildQueryParams({ limit : numberWalletsToGet, page: page});

    return Observable.create((observer) => {
      this.httpClient.get<{ data: Wallet[], meta: any }>(`${this._network.getPeerAPIUrl()}/api/v2/wallets/top`, { params: queryParams })
        .subscribe((response) => {
          topWallets = response.data;
          this.onUpdateTopWallets$.next(topWallets);
          observer.next(topWallets);
        });
      }
    );
  }

  public createTransaction(transaction: Transaction, key: string, secondKey: string, secondPassphrase: string): Observable<Transaction> {
    return Observable.create((observer) => {
      if (!arkts.PublicKey.validateAddress(transaction.address, this._network)) {
        observer.error({
          key: 'API.DESTINATION_ADDRESS_ERROR',
          parameters: {address: transaction.address}
        } as TranslatableObject);
        return observer.complete();
      }

      const wallet = this.userDataProvider.getWalletByAddress(transaction.address);

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

      const epochTime = moment(this._network.epoch).utc().valueOf();
      const now = moment().valueOf();

      const keys = ArkCrypto.Keys.fromPassphrase(key);

      transaction.timestamp = Math.floor((now - epochTime) / 1000);
      transaction.senderPublicKey = keys.publicKey;
      transaction.signature = null;
      transaction.id = null;

      const data: ArkCrypto.ITransactionData = {
        network: this._network.version,
        type: ArkCrypto.constants.TransactionTypes[ArkCrypto.constants.TransactionTypes[transaction.type]],
        senderPublicKey: transaction.senderPublicKey,
        timestamp: transaction.timestamp,
        amount: transaction.amount,
        fee: transaction.fee,
        vendorField: transaction.vendorField,
        recipientId: transaction.recipientId,
        asset: transaction.asset
      };

      data.signature = ArkCrypto.crypto.sign(data, keys);

      secondPassphrase = secondKey || secondPassphrase;

      if (secondPassphrase) {
        const secondKeys = ArkCrypto.Keys.fromPassphrase(secondPassphrase);
        data.secondSignature = ArkCrypto.crypto.secondSign(data, secondKeys);
      }

      transaction.id = ArkCrypto.crypto.getId(data);
      transaction.signature = data.signature;
      transaction.signSignature = data.secondSignature;

      observer.next(transaction);
      observer.complete();
    });
  }

  public postTransaction(transaction: arkts.Transaction, peer: arkts.Peer = this._network.activePeer, broadcast: boolean = true) {
    return Observable.create((observer) => {
      const compressTransaction = JSON.parse(JSON.stringify(transaction));
      this.client.postTransaction(compressTransaction, peer).subscribe((result: arkts.TransactionPostResponse) => {
        if (this.isSuccessfulResponse(result)) {
          this.onSendTransaction$.next(transaction);

          if (broadcast) {
            this.broadcastTransaction(transaction);
          }

          observer.next(transaction);
          if (this._network.isV2 && !result.data.accept.length && result.data.broadcast.length) {
            this.toastProvider.warn('TRANSACTIONS_PAGE.WARNING.BROADCAST');
          }
        } else {
          if (broadcast) {
            this.toastProvider.error('API.TRANSACTION_FAILED');
          }
          observer.error(result);
        }
        observer.complete();
      }, (error) => observer.error(error));
    });
  }

  public getDelegateByPublicKey(publicKey: string): Observable<Delegate> {
    if (!publicKey) {
      return Observable.of(null);
    }

    return this.client.getDelegateByPublicKey(publicKey);
  }


  private isSuccessfulResponse (response) {
    const { data, errors } = response;
    const anyDuplicate = errors && Object.keys(errors).some(transactionId => {
      return errors[transactionId].some(item => item.type === 'ERR_DUPLICATE');
    });

    // Ignore "Already in cache" error
    if (anyDuplicate) {
      return true;
    }

    return data && data.invalid.length === 0 && !errors;
  }

  private broadcastTransaction(transaction: arkts.Transaction) {
    if (!this._network.peerList || !this._network.peerList.length) {
      return;
    }

    for (const peer of this._network.peerList.slice(0, 10)) {
      this.postTransaction(transaction, peer, false).subscribe();
    }
  }

  private updateNetwork(peer?: arkts.Peer): void {
    if (peer) {
      this._network.setPeer(peer);
      this.onUpdatePeer$.next(peer);
    }
    // Save in localStorage
    this.userDataProvider.addOrUpdateNetwork(this._network, this.userDataProvider.currentProfile.networkId);
    this._api = new arkts.Client(this._network);
    this._client = new ArkClient(this._network.getPeerAPIUrl(), this.httpClient);

    this.fetchDelegates(this._network.activeDelegates * 2).subscribe((data) => {
      this._delegates = data;
    });

    this.fetchFees().subscribe();
    this.fetchFeeStatistics().subscribe();
    this.fetchNodeConfiguration().subscribe((response: NodeConfigurationResponse) => {
      const { vendorFieldLength, activeDelegates, epoch } = response.data && response.data.constants || {} as NodeConfigurationConstants;

      if (vendorFieldLength) {
        this._network.vendorFieldLength = vendorFieldLength;
      }
      if (activeDelegates) {
        this._network.activeDelegates = activeDelegates;
      }
      if (epoch) {
        this._network.epoch = new Date(epoch);
      }
    });
  }

  private fetchNodeConfiguration(): Observable<NodeConfigurationResponse> {
    if (!this._network || !this._network.isV2) {
      return Observable.empty();
    }

    return Observable.create((observer) => {
      this.httpClient.get(`${this._network.getPeerAPIUrl()}/api/v2/node/configuration`).subscribe((response: NodeConfigurationResponse) => {
        observer.next(response);
      }, e => observer.error(e));
    });
  }

  private fetchFeeStatistics(): Observable<FeeStatistic[]> {
    if (!this._network || !this._network.isV2) {
      return Observable.empty();
    }

    return Observable.create((observer) => {
      this.httpClient.get(
        `${this._network.getPeerAPIUrl()}/api/v2/node/fees?days=7`
      ).subscribe((response: NodeFeesResponse) => {
        const data = response.data;
        // Converts the new response to the old template
        const feeStatistics: FeeStatistic[] = data.map(item => ({
          type: Number(item.type),
          fees: {
            minFee: Number(item.min),
            maxFee: Number(item.max),
            avgFee: Number(item.avg),
          }
        }));

        this._network.feeStatistics = feeStatistics;
        observer.next(feeStatistics);
      }, () => {
        this.fetchNodeConfiguration().subscribe(
          (response: NodeConfigurationResponse) => {
            const data = response.data;
            this._network.feeStatistics = data.feeStatistics;
            observer.next(this._network.feeStatistics);
          },
          e => observer.error(e)
        );
      });
    });
  }

  private fetchFees(): Observable<arkts.Fees> {
    return Observable.create((observer) => {
      this.client.getTransactionFees().subscribe((response) => {
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
