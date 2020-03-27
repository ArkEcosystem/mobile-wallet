import { Network } from "ark-ts";

import { PeerApiResponse } from "@/utils/ark-client";

export interface FeeStatistic {
	type: number;
	fees: {
		minFee: number;
		maxFee: number;
		avgFee: number;
	};
}

export interface BlocksEpochResponse {
	success: boolean;
	epoch: string;
}

export class StoredNetwork extends Network {
	public marketTickerName: string;
	public peerList: PeerApiResponse[];
	public feeStatistics: FeeStatistic[];
	public epoch: Date;
	public activeDelegates: number;
	public vendorFieldLength?: number;
	public aip11: boolean;
}
