import { HttpClient } from '@angular/common/http';
import {
  Delegate,
  PeerResponse,
  Peer,
  TransactionPostResponse,
  LoaderStatusSync,
  DelegateResponse,
  TransactionResponse,
  PeerVersion2ConfigResponse,
  AccountVotesResponse,
  AccountResponse,
  BlockFees
} from 'ark-ts';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export default class ApiClient {
  private host: string;
  private httpClient: HttpClient;

  constructor(host: string, httpClient: HttpClient) {
    this.host = host;
    this.httpClient = httpClient;
  }

  private get defaultHeaders() {
    return { 'API-Version': '2' };
  }

  private get(path: string, options: any = {}, host: string = this.host) {
    return this.httpClient.request(
      'GET',
      `${host}/api/${path}`,
      { ...options, headers: this.defaultHeaders }
    ).timeout(5000);
  }

  private post(path: string, body: any | null, options: any = {}, host: string = this.host) {
    return this.httpClient.post(`${this.host}/api/${path}`, body, { ...options, headers: this.defaultHeaders }).timeout(5000);
  }

  getWallet(address: string): Observable<AccountResponse> {
    return Observable.create(observer => {
      this.get(`wallets/${address}`).subscribe((response: any) => {
        observer.next({
          success: true,
          account: {
            ...response.data,
            balance: String(response.data.balance),
          }
        });
        observer.complete();
      }, (error) => observer.error(error));
    });
  }

  getWalletVotes(address: string): Observable<AccountVotesResponse> {
    return Observable.create(observer => {
      this.get(`wallets/${address}/votes`).subscribe((response: any) => {
        const data = response.data;

        if (data.length) {
          const lastVote = data[0].asset.votes[0];

          if (lastVote.charAt(0) === '-') {
            observer.next({
              success: true,
              delegates: []
            });
            observer.complete();
          }

          const delegatePublicKey = data[0].asset.votes[0].substring(1);
          this.getDelegateByPublicKey(delegatePublicKey).subscribe(delegate => {
            observer.next({
              success: true,
              delegates: [delegate]
            });
            observer.complete();
          }, (error) => observer.error(error));
        } else {
          observer.complete();
        }
      }, (error) => observer.error(error));
    });
  }

  getTransactionList(address: string): Observable<TransactionResponse> {
    return Observable.create(observer => {
      this.get(`wallets/${address}/transactions`, { params: {
        orderBy: 'timestamp:desc'
      }}).subscribe((response: any) => {
        observer.next({
          success: true,
          transactions: response.data.map(transaction => ({
            ...transaction,
            recipientId: transaction.recipient,
            senderId: transaction.sender,
            timestamp: transaction.timestamp.epoch
          })),
          count: response.meta.totalCount.toString()
        });
        observer.complete();
      }, (error) => observer.error(error));
    });
  }

  getTransactionFees(): Observable<BlockFees> {
    return Observable.create(observer => {
      this.get('transactions/fees').subscribe((response: any) => {
        const data = response.data;
        observer.next({
          success: true,
          fees: {
            send: data.transfer,
            vote: data.vote,
            secondsignature: data.secondSignature,
            delegate: data.delegateRegistration,
            multisignature: data.multiSignature
          }
        });
        observer.complete();
      }, (error) => observer.error(error));
    });
  }

  getPeerSyncing(host: string): Observable<LoaderStatusSync> {
    return Observable.create(observer => {
      this.get(`node/syncing`, {}, host).subscribe((response: any) => {
        observer.next({
          success: true,
          ...response.data
        });
        observer.complete();
      }, (error) => observer.error(error));
    });
  }

  getPeerList(): Observable<PeerResponse> {
    return Observable.create(observer => {
      this.get('peers').subscribe((response: any) => {
        observer.next({
          success: true,
          peers: response.data
        });
        observer.complete();
      }, (error) => observer.error(error));
    });
  }

  getPeer(ip: string): Observable<PeerResponse> {
    return Observable.create(observer => {
      this.get(`peers/${ip}`).subscribe((response: any) => {
        observer.next({
          success: true,
          peer: response.data
        });
        observer.complete();
      }, (error) => observer.error(error));
    });
  }

  getPeerConfig(ip: string, port: number, protocol: 'http' | 'https' = 'http'): Observable<PeerVersion2ConfigResponse> {
    return Observable.create(observer => {
      this.httpClient.get(`${protocol}://${ip}:4040/config`).timeout(2000).subscribe((response: any) => {
        observer.next(response);
        observer.complete();
      }, () => {
        this.httpClient.get(`${protocol}://${ip}:${port}/config`).timeout(2000).subscribe((response: any) => {
          observer.next(response);
          observer.complete();
        }, (error) => observer.error(error));
      });
    });
  }

  postTransaction(transaction: any, peer: Peer, protocol: 'http' | 'https' = 'http'): Observable<TransactionPostResponse> {
    return Observable.create(observer => {
      this.post(
        'transactions',
        { transactions: [transaction] },
        { headers: this.defaultHeaders },
        `${protocol}://${peer.ip}:${peer.port}`
      ).subscribe((response: any) => {
        observer.next(response);
        observer.complete();
      }, (error) => observer.error(error));
    });
  }

  getDelegateList(options: any = { page: 1, limit: 100, orderBy: 'rank:asc' }): Observable<DelegateResponse> {
    return Observable.create(observer => {
      this.get('delegates', { params: options }).subscribe((response: any) => {
        observer.next({
          success: true,
          delegates: response.data.map(delegate => this.__formatDelegateResponse(delegate)),
          totalCount: parseInt(response.meta.totalCount)
        });
        observer.complete();
      }, (error) => observer.error(error));
    });
  }

  getDelegateByPublicKey(publicKey: string): Observable<Delegate> {
    if (!publicKey) {
      return Observable.of(null);
    }

    return Observable.create(observer => {
      this.get(`delegates/${publicKey}`).subscribe((response: any) => {
        const data = response.data;
        observer.next(this.__formatDelegateResponse(data));
        observer.complete();
      }, (error) => observer.error(error));
    });
  }

  __formatDelegateResponse(response: any) {
    const delegate = {
      username: response.username,
      address: response.address,
      publicKey: response.publicKey,
      rate: response.rank
    } as Delegate;

    if (response.blocks) {
      delegate.producedBlocks = response.blocks.produced || 0;
      delegate.missedBlocks = response.blocks.missed || 0;
    }

    if (response.production) {
      delegate.approval = response.production.approval || 0;
      delegate.productivity = response.production.productivity || 0;
    }

    return delegate;
  }
}
