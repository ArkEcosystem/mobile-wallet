import { HttpClient } from "@angular/common/http";
import {
	AccountResponse,
	AccountVotesResponse,
	BlockFees,
	Delegate,
	DelegateResponse,
	LoaderStatusSync,
	Peer,
	PeerResponse,
	PeerVersion2ConfigResponse,
	TransactionPostResponse,
	TransactionResponse,
} from "ark-ts";
import lodash from "lodash";
import { Observable, of } from "rxjs";
import { timeout } from "rxjs/operators";

import { TRANSACTION_GROUPS } from "@/app/app.constants";
import { INodeConfiguration } from "@/models/node";

export interface PeerApiResponse extends Peer {
	latency?: number;
	ports?: {
		[plugin: string]: number;
	};
}

export interface WalletResponse extends AccountResponse {
	balance: string;
	isDelegate: boolean;
	vote: string;
	nonce: string;
}

export default class ApiClient {
	private host: string;
	private httpClient: HttpClient;

	constructor(host: string, httpClient: HttpClient) {
		this.host = host;
		this.httpClient = httpClient;
	}

	getWallet(address: string): Observable<WalletResponse> {
		return new Observable((observer) => {
			this.get(`wallets/${address}`).subscribe(
				(response: any) => {
					if (response && response.data) {
						observer.next({
							...response.data,
						});
					} else {
						observer.error();
					}
					observer.complete();
				},
				(error) => observer.error(error),
			);
		});
	}

	getWalletVotes(address: string): Observable<AccountVotesResponse> {
		return new Observable((observer) => {
			this.get(`wallets/${address}/votes`).subscribe(
				(response: any) => {
					const data = response.data;

					if (data.length) {
						const lastVote = data[0].asset.votes[0];

						if (lastVote.charAt(0) === "-") {
							observer.next({
								success: true,
								delegates: [],
							});
							observer.complete();
						}

						const delegatePublicKey = data[0].asset.votes[0].substring(
							1,
						);
						this.getDelegateByPublicKey(
							delegatePublicKey,
						).subscribe(
							(delegate) => {
								observer.next({
									success: true,
									delegates: [delegate],
								});
								observer.complete();
							},
							(error) => observer.error(error),
						);
					} else {
						observer.complete();
					}
				},
				(error) => observer.error(error),
			);
		});
	}

	getTransactionList(address: string): Observable<TransactionResponse> {
		return new Observable((observer) => {
			this.get(`wallets/${address}/transactions`, {
				params: {
					orderBy: "timestamp:desc",
				},
			}).subscribe(
				(response: any) => {
					observer.next({
						success: true,
						transactions: response.data.map((transaction) => ({
							...transaction,
							recipientId: transaction.recipient,
							senderId: transaction.sender,
							timestamp: transaction.timestamp.unix,
						})),
						count: response.meta.totalCount.toString(),
						transaction: null,
						error: null,
					});
					observer.complete();
				},
				(error) => observer.error(error),
			);
		});
	}

	getTransactionFees(): Observable<BlockFees> {
		return new Observable((observer) => {
			this.get("transactions/fees").subscribe(
				(response: any) => {
					const data = response.data;
					const payload = data[TRANSACTION_GROUPS.STANDARD]
						? data[TRANSACTION_GROUPS.STANDARD]
						: data;

					observer.next({
						success: true,
						fees: {
							send: payload.transfer,
							vote: payload.vote,
							secondsignature: payload.secondSignature,
							delegate: payload.delegateRegistration,
							multisignature: payload.multiSignature,
						},
					});
					observer.complete();
				},
				(error) => observer.error(error),
			);
		});
	}

	getNodeCrypto(host: string): Observable<any> {
		return new Observable((observer) => {
			this.get("node/configuration/crypto", {}, host).subscribe(
				(response: any) => {
					observer.next(response.data);
					observer.complete();
				},
				(error) => observer.error(error),
			);
		});
	}

	getNodeConfiguration(host?: string): Observable<INodeConfiguration> {
		return new Observable((observer) => {
			this.get(`node/configuration`, {}, host).subscribe(
				(response: any) => {
					observer.next(response.data);
					observer.complete();
				},
				(error) => observer.error(error),
			);
		});
	}

	getPeerSyncing(
		host: string,
		timeoutMs?: number,
	): Observable<LoaderStatusSync> {
		return new Observable((observer) => {
			this.get(`node/syncing`, {}, host, timeoutMs).subscribe(
				(response: any) => {
					observer.next({
						success: true,
						...response.data,
					});
					observer.complete();
				},
				(error) => observer.error(error),
			);
		});
	}

	getPeerList(): Observable<PeerResponse> {
		return new Observable((observer) => {
			this.get("peers").subscribe(
				(response: any) => {
					observer.next({
						success: true,
						peers: response.data,
						peer: null,
					});
					observer.complete();
				},
				(error) => observer.error(error),
			);
		});
	}

	getPeer(
		ip: string,
		host?: string,
		timeoutMs?: number,
	): Observable<PeerApiResponse> {
		return new Observable((observer) => {
			this.get(`peers/${ip}`, null, host, timeoutMs).subscribe(
				(response: any) => {
					observer.next(response.data);
					observer.complete();
				},
				(error) => observer.error(error),
			);
		});
	}

	getPeerConfig(
		ip: string,
		port: number,
		protocol: "http" | "https" = "http",
	): Observable<PeerVersion2ConfigResponse> {
		return new Observable((observer) => {
			this.httpClient
				.get(`${protocol}://${ip}:4040/config`)
				.pipe(timeout(2000))
				.subscribe(
					(response: any) => {
						observer.next(response);
						observer.complete();
					},
					() => {
						this.httpClient
							.get(`${protocol}://${ip}:${port}/config`)
							.pipe(timeout(2000))
							.subscribe(
								(response: any) => {
									observer.next(response);
									observer.complete();
								},
								() => {
									this.getNodeConfiguration(
										`${protocol}://${ip}:${port}`,
									).subscribe(
										(response) => {
											const apiPort = lodash.find(
												response.ports,
												(_, key) =>
													key
														.split("/")
														.reverse()[0] ===
													"core-wallet-api",
											);
											const isApiEnabled =
												apiPort && Number(apiPort) > 1;
											if (isApiEnabled) {
												this.getPeerConfig(
													ip,
													apiPort,
													protocol,
												).subscribe(
													(r) => observer.next(r),
													(e) => observer.error(e),
												);
											} else {
												observer.error();
											}
										},
										(error) => observer.error(error),
									);
								},
							);
					},
				);
		});
	}

	postTransaction(
		transaction: any,
		peer: Peer,
		protocol: "http" | "https" = "http",
	): Observable<TransactionPostResponse> {
		return new Observable((observer) => {
			this.post(
				"transactions",
				{ transactions: [transaction] },
				{ headers: this.defaultHeaders },
				`${protocol}://${peer.ip}:${peer.port}`,
			).subscribe(
				(response: any) => {
					observer.next(response);
					observer.complete();
				},
				(error) => observer.error(error),
			);
		});
	}

	getDelegateList(
		options: any = { page: 1, limit: 100, orderBy: "rank:asc" },
	): Observable<DelegateResponse> {
		return new Observable((observer) => {
			this.get("delegates", { params: options }).subscribe(
				(response: any) => {
					observer.next({
						success: true,
						delegates: response.data.map((delegate) =>
							this.__formatDelegateResponse(delegate),
						),
						totalCount: parseInt(response.meta.totalCount),
					});
					observer.complete();
				},
				(error) => observer.error(error),
			);
		});
	}

	getDelegateByPublicKey(publicKey: string): Observable<Delegate> {
		if (!publicKey) {
			return of(null);
		}

		return new Observable((observer) => {
			this.get(`delegates/${publicKey}`).subscribe(
				(response: any) => {
					const data = response.data;
					observer.next(this.__formatDelegateResponse(data));
					observer.complete();
				},
				(error) => observer.error(error),
			);
		});
	}

	__formatDelegateResponse(response: any) {
		const delegate = {
			username: response.username,
			address: response.address,
			publicKey: response.publicKey,
			rate: response.rank,
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

	private get defaultHeaders() {
		return { "API-Version": "2" };
	}

	private get(
		path: string,
		options: any = {},
		host: string = this.host,
		timeoutMs: number = 5000,
	) {
		return this.httpClient
			.request("GET", `${host}/api/${path}`, {
				...options,
				headers: this.defaultHeaders,
			})
			.pipe(timeout(timeoutMs));
	}

	private post(
		path: string,
		body: any | null,
		options: any = {},
		host: string = this.host,
	) {
		return this.httpClient
			.post(`${this.host}/api/${path}`, body, {
				...options,
				headers: this.defaultHeaders,
			})
			.pipe(timeout(5000));
	}
}
