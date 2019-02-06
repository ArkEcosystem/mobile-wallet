import { Network, Peer } from 'ark-ts';

export interface BlocksEpochResponse {
  success: boolean;
  epoch: string;
}

export class StoredNetwork extends Network {
  public marketTickerName: string;
  public peerList: Peer[];
  public epoch: Date;
}
