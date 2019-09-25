import { PeerApiResponse } from './ark-client';
import orderBy from 'lodash/orderBy';
import { HttpClient } from '@angular/common/http';
import isUrl from 'is-url';
import semver from 'semver';

export class PeerDiscovery {
  private version: string | undefined;
  private latency: number | undefined;
  private orderBy: string[] = ['latency', 'desc'];
  private readonly seeds: PeerApiResponse[];
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient, seeds: PeerApiResponse[] = []) {
    this.seeds = seeds;
    this.httpClient = httpClient;
  }

  public async find({
    networkOrHost,
    defaultPort = 4003
  }: {
    networkOrHost: string;
    defaultPort?: number;
  }): Promise<PeerDiscovery> {
    debugger;
    if (!networkOrHost || typeof networkOrHost !== 'string') {
      throw new Error('No network or host provided');
    }

    const seeds: PeerApiResponse[] = [];

    try {
      if (isUrl(networkOrHost)) {
        const body = await this.httpClient.get(networkOrHost).toPromise();

        for (const seed of body['data']) {
          let port = defaultPort;
          if (seed.ports) {
            const walletApiPort = seed.ports['@arkecosystem/core-wallet-api'];
            const apiPort = seed.ports['@arkecosystem/core-api'];
            if (walletApiPort >= 1 && walletApiPort <= 65535) {
              port = walletApiPort;
            } else if (apiPort >= 1 && apiPort <= 65535) {
              port = apiPort;
            }
          }

          seeds.push({ ip: seed.ip, port });
        }
      } else {
        const body: any = await this.httpClient
          .get(
            `https://raw.githubusercontent.com/ArkEcosystem/peers/master/${networkOrHost}.json`
          )
          .toPromise();

        for (const seed of body) {
          seeds.push({ ip: seed.ip, port: defaultPort });
        }
      }
    } catch (error) {
      throw new Error('Failed to discovery any peers.');
    }

    if (!seeds.length) {
      throw new Error('No seeds found');
    }

    return new PeerDiscovery(this.httpClient, seeds);
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

  public sortBy(key: string, direction = 'desc'): PeerDiscovery {
    this.orderBy = [key, direction];

    return this;
  }

  public async findPeers(opts: any = {}): Promise<PeerApiResponse[]> {
    if (!opts.retry) {
      opts.retry = { retries: 0 };
    }

    if (!opts.timeout) {
      opts.timeout = 3000;
    }

    const seed: PeerApiResponse = this.seeds[
      Math.floor(Math.random() * this.seeds.length)
    ];

    const body: any = await this.httpClient
      .request('get', `http://${seed.ip}:${seed.port}/api/v2/peers`, {
        body: opts
      })
      .toPromise();

    let peers = body.data;

    if (this.version) {
      peers = peers.filter((peer: PeerApiResponse) =>
        semver.satisfies(peer.version, this.version)
      );
    }

    if (this.latency) {
      peers = peers.filter(
        (peer: PeerApiResponse) => peer.latency <= this.latency
      );
    }

    return orderBy<PeerApiResponse>(
      peers,
      [this.orderBy[0]],
      [this.orderBy[1] as any]
    );
  }

  public async findPeersWithPlugin(
    name: string,
    opts: { additional?: string[] } = {}
  ): Promise<PeerApiResponse[]> {
    const peers: PeerApiResponse[] = [];

    for (const peer of await this.findPeers(opts)) {
      const pluginName: string | undefined = Object.keys(peer.ports).find(
        (key: string) => key.split('/')[1] === name
      );

      if (pluginName) {
        const port: number = peer.ports[pluginName];

        if (port >= 1 && port <= 65535) {
          const peerData: PeerApiResponse = {
            ip: peer.ip,
            port
          };

          if (opts.additional && Array.isArray(opts.additional)) {
            for (const additional of opts.additional) {
              if (typeof peer[additional] === 'undefined') {
                continue;
              }

              peerData[additional] = peer[additional];
            }
          }

          peers.push(peerData);
        }
      }
    }

    return peers;
  }
}
