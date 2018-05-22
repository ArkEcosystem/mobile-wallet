import { Network, Peer } from 'ark-ts';

export class StoredNetwork extends Network {
  public marketTickerName: string;
  public peerList: Peer[];
}
