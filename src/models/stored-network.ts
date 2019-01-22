import { Network, Peer } from 'ark-ts';

export interface FeeStatistic {
  type: number;
  fees: {
    minFee: number,
    maxFee: number,
    avgFee: number,
  };
}

export class StoredNetwork extends Network {
  public marketTickerName: string;
  public peerList: Peer[];
  public feeStatistics: FeeStatistic[];
}
