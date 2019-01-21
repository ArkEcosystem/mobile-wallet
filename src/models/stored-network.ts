import { Network, Peer } from 'ark-ts';

export interface FeeStatistic {
  type: Number;
  fees: {
    minFee: Number,
    maxFee: Number,
    avgFee: Number,
  };
}

export class StoredNetwork extends Network {
  public marketTickerName: string;
  public peerList: Peer[];
  public feeStatistics: FeeStatistic[];
}
