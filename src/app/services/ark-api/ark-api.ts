import { Injectable, NgZone } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import { Observable, Subject, of, empty } from 'rxjs';

import { UserDataProvider } from '@/services/user-data/user-data';
import { StorageProvider } from '@/services/storage/storage';
import { ToastProvider } from '@/services/toast/toast';
import { HttpUtils } from '@/app/utils/http-utils';

import { Transaction, TranslatableObject, Wallet, INodeConfiguration } from '@/models/model';

import * as arkts from 'ark-ts';
import lodash from 'lodash';
import moment from 'moment';
import BigNumber from '@/utils/bignumber';
import * as constants from '@/app/app.constants';
import arktsConfig from 'ark-ts/config';
import { ArkUtility } from '../../utils/ark-utility';
import { StoredNetwork, FeeStatistic } from '@/models/stored-network';
import ArkClient, { WalletResponse } from '../../utils/ark-client';
import * as ArkCrypto from '@arkecosystem/crypto';
import { PeerDiscovery } from '@/utils/ark-peer-discovery';
import { expand, finalize, tap, switchMap } from 'rxjs/operators';

interface NodeFees {
  type: number;
  min: number;
  max: number;
  avg: number;
}

interface NodeFeesResponse {
  data: NodeFees[] | {
    [group: string]: {
      [type: string]: NodeFees;
    }
  };
}

@Injectable({ providedIn: 'root' })
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
    if (!lodash.isUndefined(this._network.feeStatistics)) { return of(this._network.feeStatistics); }

    return this.fetchFeeStatistics();
  }

  public get fees() {
    if (!lodash.isUndefined(this._fees)) { return of(this._fees); }

    return this.fetchFees();
  }

  public get delegates(): Observable<arkts.Delegate[]> {
    if (!lodash.isEmpty(this._delegates)) { return of(this._delegates); }

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

    this._api = new arkts.Client(this._network);
    this._client = new ArkClient(this.network.getPeerAPIUrl(), this.httpClient);
    this._peerDiscovery = new PeerDiscovery(this.httpClient);

    // Fallback if the fetchEpoch fail
    this._network.epoch = arktsConfig.blockchain.date;
    // Fallback if the fetchNodeConfiguration fail
    this._network.activeDelegates = constants.NUM_ACTIVE_DELEGATES;

    this.connectToRandomPeer().subscribe(null, (e) => console.error(e));
    
    this.userDataProvider.onUpdateNetwork$.next(this._network);
    
    this.fetchFees().subscribe();
  }

  private refreshPeers(): Observable<void> {
    return new Observable(observer => {
      const network = this._network;
      const networkLookup = ['mainnet', 'devnet'];
      const isKnowNetwork = lodash.includes(networkLookup, network.name);
      const peerUrl = network.getPeerAPIUrl();

      const networkOrHost = isKnowNetwork ? network.name : `${peerUrl}/api/peers`;

      this._peerDiscovery.find({ networkOrHost }).subscribe(discovery => {
        discovery
          .withLatency(300)
          .sortBy('latency', 'asc');

        discovery
          .findPeersWithPlugin('core-api', {
            additional: [
              'height',
              'latency',
              'version'
            ]
          })
          .pipe(
            switchMap(peers => {
              if (!peers.length) {
                return discovery.findPeersWithPlugin('core-wallet-api', {
                  additional: [
                    'height',
                    'latency',
                    'version'
                  ]
                });
              }
  
              return of(peers);
            })
          )
          .subscribe(peers => {
            if (peers.length) {
              this._network.peerList = peers;
              observer.next();
            } else {
              observer.error('No good peer could be found!');
            }
          }, (e) => observer.error(e));
      }, (e) => observer.error(e));
    });
  }

  public connectToRandomPeer(): Observable<void> {
    return Observable.create(observer => {
      this.refreshPeers().subscribe(() => {
        this.updateNetwork(this._network.peerList[lodash.random(this._network.peerList.length - 1)]);
        observer.next();
        observer.complete();
      }, (e) => {
        this.updateNetwork();
        observer.error(e);
      });
    });
  }

  public fetchDelegates(numberDelegatesToGet: number, getAllDelegates = false): Observable<arkts.Delegate[]> {
    if (!this._api) { return; }
    const limit = this._network.activeDelegates;

    const totalCount = limit;
    let page = 1;

    let totalPages = totalCount / limit;

    let delegates: arkts.Delegate[] = [];

    return Observable.create((observer) => {

      this.client.getDelegateList({ limit, page }).pipe(
        expand(() => {
          const next = this.client.getDelegateList({ limit, page });
          return (page - 1) < totalPages ? next : empty();
        }),
        tap((response) => {
          if (response.success && getAllDelegates) { numberDelegatesToGet = response.totalCount; }
          totalPages = Math.ceil(numberDelegatesToGet / limit);
          page++;
        }),
        finalize(() => {
          this.storageProvider.set(constants.STORAGE_DELEGATES, delegates);
          this.onUpdateDelegates$.next(delegates);
  
          observer.next(delegates);
          observer.complete();
        })
      )
      .subscribe((data) => {
        if (data.success) { delegates = [...delegates, ...data.delegates]; }
      });
    });

  }

  fetchTopWallets(numberWalletsToGet: number, page?: number): Observable<Wallet[]> {
    if (!this._network || !this._network.isV2) {
      return empty();
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

      const keys = ArkCrypto.Identities.Keys.fromPassphrase(key);

      transaction.timestamp = Math.floor((now - epochTime) / 1000);
      transaction.senderPublicKey = keys.publicKey;
      transaction.signature = null;
      transaction.id = null;

      const data: ArkCrypto.Interfaces.ITransactionData = {
        network: this._network.version,
        type: ArkCrypto.Enums.TransactionType[ArkCrypto.Enums.TransactionType[transaction.type]],
        senderPublicKey: transaction.senderPublicKey,
        timestamp: transaction.timestamp,
        amount: new ArkCrypto.Utils.BigNumber(transaction.amount),
        fee: new ArkCrypto.Utils.BigNumber(transaction.fee),
        vendorField: transaction.vendorField,
        recipientId: transaction.recipientId,
        asset: transaction.asset
      };

      this.getNextWalletNonce(wallet.address)
        .pipe(
          tap(nonce => {
            if (this._network.aip11) {
              transaction.nonce = nonce;
              transaction.typeGroup = 1;
              data.typeGroup = 1;
              // @ts-ignore
              data.nonce = nonce;
              data.typeGroup = 1;
              data.version = 2;
            }
          }),
          finalize(() => {
            data.signature = ArkCrypto.Transactions.Signer.sign(data, keys);

            secondPassphrase = secondKey || secondPassphrase;

            if (secondPassphrase) {
              const secondKeys = ArkCrypto.Identities.Keys.fromPassphrase(secondPassphrase);
              data.secondSignature = ArkCrypto.Transactions.Signer.secondSign(data, secondKeys);
            }

            transaction.id = ArkCrypto.Transactions.Utils.getId(data);
            transaction.signature = data.signature;
            transaction.signSignature = data.secondSignature;
            transaction.version = data.version || 1;

            observer.next(transaction);
            observer.complete();
          })
        )
        .subscribe();
    });
  }

  private getNextWalletNonce(address: string): Observable<string> {
    return Observable.create(observer => {
      this._client.getWallet(address).subscribe((wallet: WalletResponse) => {
        const nonce = wallet.nonce || 0;
        const nextNonce = new BigNumber(nonce).plus(1).toString();
        observer.next(nextNonce);
      },
      () => observer.next('1'),
      () => observer.complete());
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

  public getDelegateByPublicKey(publicKey: string): Observable<arkts.Delegate> {
    if (!publicKey) {
      return of(null);
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
    this.fetchNodeConfiguration().subscribe((response: INodeConfiguration) => {
      const config = response.constants;

      this._network.vendorFieldLength = config.vendorFieldLength;
      this._network.activeDelegates = config.activeDelegates;
      this._network.epoch = new Date(config.epoch);

      if (config.aip11) {
        this._network.aip11 = config.aip11;
      }

      this._client.getNodeCrypto(this._network.getPeerAPIUrl())
        .subscribe((crypto: any) => {
          ArkCrypto.Managers.configManager.setConfig(crypto);
          ArkCrypto.Managers.configManager.setHeight(config.height);
        });
    });
  }

  private fetchNodeConfiguration(): Observable<INodeConfiguration> {
    return this._client.getNodeConfiguration(this._network.getPeerAPIUrl());
  }

  private fetchFeeStatistics(): Observable<FeeStatistic[]> {
    if (!this._network || !this._network.isV2) {
      return empty();
    }

    return Observable.create((observer) => {
      this.httpClient.get(
        `${this._network.getPeerAPIUrl()}/api/v2/node/fees?days=7`
      ).subscribe((response: NodeFeesResponse) => {
        const data = response.data;
        let feeStatistics: FeeStatistic[] = [];

        if (Array.isArray(data)) {
          feeStatistics = data.map(fee => ({
            type: Number(fee.type),
            fees: {
              minFee: Number(fee.min),
              maxFee: Number(fee.max),
              avgFee: Number(fee.avg)
            }
          }));
        } else {
          const standard = data[constants.TRANSACTION_GROUPS.STANDARD];

          for (const type in standard) {
            const fee = standard[type];
            const typeFormatted = lodash.snakeCase(type).toUpperCase();

            feeStatistics.push({
              type: constants.TRANSACTION_TYPES.GROUP_1[typeFormatted],
              fees: {
                minFee: Number(fee.min),
                maxFee: Number(fee.max),
                avgFee: Number(fee.avg)
              }
            });
          }
        }

        this._network.feeStatistics = feeStatistics;
        observer.next(this._network.feeStatistics);
      }, (e) => observer.error(e));
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
