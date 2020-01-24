export interface IFees {
	transfer: number;
	secondSignature: number;
	delegateRegistration: number;
	vote: number;
	multiSignature: number;
	ipfs: number;
	multiPayment: number;
	delegateResignation: number;
	htlcLock: number;
	htlcClaim: number;
	htlcRefund: number;
}

export interface INodeConfiguration {
	nethash: string;
	slip44: number;
	wif: number;
	token: string;
	symbol: string;
	explorer: string;
	version: number;
	ports: {
		[plugin: string]: number | null;
	};
	constants: {
		height: number;
		reward: number;
		activeDelegates: number;
		blocktime: number;
		block: {
			version: number;
			maxTransactions?: number;
			maxPayload?: number;
			acceptExpiredTransactionTimestamps?: boolean;
			idFullSha256?: boolean;
		};
		epoch: string;
		fees: {
			staticFees: IFees;
		};
		ignoreInvalidSecondSignatureField?: boolean;
		ignoreExpiredTransactions: boolean;
		vendorFieldLength: number;
		multiPaymentLimit?: number;
		p2p?: {
			minimumVersions: string[];
		};
		aip11?: true;
	};
	transactionPool: {
		dynamicFees: {
			enabled: boolean;
			minFeePool: number;
			minFeeBroadcast: number;
			addonBytes: IFees;
		};
	};
}
