import { HttpClient } from "@angular/common/http";
import isUrl from "is-url";
import orderBy from "lodash/orderBy";
import { Observable } from "rxjs/Observable";
import semver from "semver";

import { PeerApiResponse } from "./ark-client";

export class PeerDiscovery {
	private version: string | undefined;
	private latency: number | undefined;
	private orderBy: string[] = ["latency", "desc"];
	private readonly seeds: PeerApiResponse[];
	private readonly httpClient: HttpClient;

	constructor(httpClient: HttpClient, seeds: PeerApiResponse[] = []) {
		this.seeds = seeds;
		this.httpClient = httpClient;
	}

	public find({
		networkOrHost,
		defaultPort = 4003,
	}: {
		networkOrHost: string;
		defaultPort?: number;
	}): Observable<PeerDiscovery> {
		return new Observable((observer) => {
			if (!networkOrHost || typeof networkOrHost !== "string") {
				observer.error("No network or host provided");
			}

			try {
				if (isUrl(networkOrHost)) {
					this.getSeedsFromHost(networkOrHost, defaultPort).subscribe(
						(response) => {
							observer.next(
								new PeerDiscovery(this.httpClient, response),
							);
							observer.complete();
						},
						(e) => observer.error(e),
					);
				} else {
					this.getSeedsFromRepository(
						networkOrHost,
						defaultPort,
					).subscribe(
						(response) => {
							observer.next(
								new PeerDiscovery(this.httpClient, response),
							);
							observer.complete();
						},
						(e) => observer.error(e),
					);
				}
			} catch (error) {
				observer.error("Failed to discovery any peers.");
			}
		});
	}

	public getSeeds(): PeerApiResponse[] {
		return this.seeds;
	}

	public withVersion(version: string): PeerDiscovery {
		this.version = version;

		return this;
	}

	public withLatency(latency: number): PeerDiscovery {
		this.latency = latency;

		return this;
	}

	public sortBy(key: string, direction = "desc"): PeerDiscovery {
		this.orderBy = [key, direction];

		return this;
	}

	public findPeers(opts: any = {}): Observable<PeerApiResponse[]> {
		return new Observable((observer) => {
			if (!opts.retry) {
				opts.retry = { retries: 0 };
			}

			if (!opts.timeout) {
				opts.timeout = 3000;
			}

			if (this.seeds.length) {
				const seed: PeerApiResponse = this.seeds[
					Math.floor(Math.random() * this.seeds.length)
				];

				this.httpClient
					.request(
						"GET",
						`http://${seed.ip}:${seed.port}/api/peers`,
						{
							headers: {
								"API-Version": "2",
							},
						},
					)
					.subscribe(
						(body: any) => {
							let peers = body.data;

							if (this.version) {
								peers = peers.filter((peer: PeerApiResponse) =>
									semver.satisfies(
										peer.version,
										this.version,
									),
								);
							}

							if (this.latency) {
								peers = peers.filter(
									(peer: PeerApiResponse) =>
										peer.latency <= this.latency,
								);
							}

							observer.next(
								orderBy<PeerApiResponse>(
									peers,
									[this.orderBy[0]],
									[this.orderBy[1] as any],
								),
							);
							observer.complete();
						},
						(e) => {
							observer.error(e);
						},
					);
			} else {
				observer.next([]);
				observer.complete();
			}
		});
	}

	public findPeersWithPlugin(
		name: string,
		opts: { additional?: string[] } = {},
	): Observable<PeerApiResponse[]> {
		return new Observable((observer) => {
			this.findPeers(opts).subscribe(
				(response) => {
					const peers: PeerApiResponse[] = [];

					for (const peer of response) {
						const pluginName: string | undefined = Object.keys(
							peer.ports,
						).find((key: string) => key.split("/")[1] === name);

						if (pluginName) {
							const port: number = peer.ports[pluginName];

							if (port >= 1 && port <= 65535) {
								const peerData: PeerApiResponse = {
									ip: peer.ip,
									port,
								};

								if (
									opts.additional &&
									Array.isArray(opts.additional)
								) {
									for (const additional of opts.additional) {
										if (
											typeof peer[additional] ===
											"undefined"
										) {
											continue;
										}

										peerData[additional] = peer[additional];
									}
								}

								peers.push(peerData);
							}
						}
					}

					observer.next(peers);
					observer.complete();
				},
				(e) => observer.error(e),
			);
		});
	}

	private getSeedsFromHost(
		host: string,
		defaultPort: number,
	): Observable<PeerApiResponse[]> {
		return new Observable((observer) => {
			this.httpClient.get(host).subscribe(
				(body: any) => {
					const seeds: PeerApiResponse[] = [];

					for (const seed of body.data) {
						let port = defaultPort;
						if (seed.ports) {
							const walletApiPort =
								seed.ports["@arkecosystem/core-wallet-api"];
							const apiPort =
								seed.ports["@arkecosystem/core-api"];
							if (walletApiPort >= 1 && walletApiPort <= 65535) {
								port = walletApiPort;
							} else if (apiPort >= 1 && apiPort <= 65535) {
								port = apiPort;
							}
						}

						seeds.push({ ip: seed.ip, port });
					}

					observer.next(seeds);
					observer.complete();
				},
				(e) => observer.error(e),
			);
		});
	}

	private getSeedsFromRepository(
		network: string,
		defaultPort: number,
	): Observable<PeerApiResponse[]> {
		return new Observable((observer) => {
			this.httpClient
				.get(
					`https://raw.githubusercontent.com/ArkEcosystem/peers/master/${network}.json`,
				)
				.subscribe(
					(body: any) => {
						const seeds: PeerApiResponse[] = [];
						for (const seed of body) {
							seeds.push({ ip: seed.ip, port: defaultPort });
						}
						observer.next(seeds);
						observer.complete();
					},
					(e) => observer.error(e),
				);
		});
	}
}
