import { Interfaces } from "@arkecosystem/crypto";
import { Transaction as TransactionModel, TransactionType } from "ark-ts/model";
import moment from "moment";

import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from "@/app/app.constants";
import { MarketCurrency, MarketHistory, MarketTicker } from "@/models/market";
import { SafeBigNumber as BigNumber } from "@/utils/bignumber";

import { ArkUtility } from "../utils/ark-utility";

const TX_TYPES = {
	1: {
		0: "TRANSACTIONS_PAGE.SENT",
		1: "TRANSACTIONS_PAGE.SECOND_SIGNATURE_CREATION",
		2: "TRANSACTIONS_PAGE.DELEGATE_REGISTRATION",
		3: "DELEGATES_PAGE.VOTE",
		4: "TRANSACTIONS_PAGE.MULTISIGNATURE_REGISTRATION",
		5: "TRANSACTIONS_PAGE.IPFS",
		6: "TRANSACTIONS_PAGE.MULTI_PAYMENT",
		7: "TRANSACTIONS_PAGE.DELEGATE_RESIGNATION",
		8: "TRANSACTIONS_PAGE.HTLC_LOCK",
		9: "TRANSACTIONS_PAGE.HTLC_CLAIM",
		10: "TRANSACTIONS_PAGE.HTLC_REFUND",
	},
	2: {
		0: "TRANSACTIONS_PAGE.BUSINESS_REGISTRATION",
		1: "TRANSACTIONS_PAGE.BUSINESS_RESIGNATION",
		2: "TRANSACTIONS_PAGE.BUSINESS_UPDATE",
		3: "TRANSACTIONS_PAGE.BRIDGECHAIN_REGISTRATION",
		4: "TRANSACTIONS_PAGE.BRIDGECHAIN_RESIGNATION",
		5: "TRANSACTIONS_PAGE.BRIDGECHAIN_UPDATE",
	},
};

const TX_TYPES_ACTIVITY = {
	1: {
		0: "TRANSACTIONS_PAGE.SENT_TO",
		1: "TRANSACTIONS_PAGE.SECOND_SIGNATURE_CREATION",
		2: "TRANSACTIONS_PAGE.DELEGATE_REGISTRATION",
		3: "DELEGATES_PAGE.VOTE",
		4: "TRANSACTIONS_PAGE.MULTISIGNATURE_REGISTRATION",
		5: "TRANSACTIONS_PAGE.IPFS",
		6: "TRANSACTIONS_PAGE.MULTI_PAYMENT",
		7: "TRANSACTIONS_PAGE.DELEGATE_RESIGNATION",
		8: "TRANSACTIONS_PAGE.HTLC_LOCK",
		9: "TRANSACTIONS_PAGE.HTLC_CLAIM",
		10: "TRANSACTIONS_PAGE.HTLC_REFUND",
	},
	2: {
		0: "TRANSACTIONS_PAGE.BUSINESS_REGISTRATION",
		1: "TRANSACTIONS_PAGE.BUSINESS_RESIGNATION",
		2: "TRANSACTIONS_PAGE.BUSINESS_UPDATE",
		3: "TRANSACTIONS_PAGE.BRIDGECHAIN_REGISTRATION",
		4: "TRANSACTIONS_PAGE.BRIDGECHAIN_RESIGNATION",
		5: "TRANSACTIONS_PAGE.BRIDGECHAIN_UPDATE",
	},
};

export type TransactionEntity = TransactionModel & {
	isSender: boolean;
	isTransfer: boolean;
	isMultipayment: boolean;
	appropriateAddress: string;
	activityLabel: string;
	typeLabel: string;
	totalAmount: number;
	date: Date;
	asset: Interfaces.ITransactionAsset;
	amountEquivalent: number;
};

export interface SendTransactionForm {
	amount?: number;
	amountEquivalent?: number;
	fee?: number;
	recipientAddress?: string;
	recipientName?: string;
	smartBridge?: string;
}

export class Transaction extends TransactionModel {
	public nonce?: string;
	public typeGroup?: number;
	public version?: number;
	public date: Date;
	public asset: Interfaces.ITransactionAsset;

	constructor(public address: string) {
		super();
	}

	deserialize(input: any): Transaction {
		const self: any = this;

		for (const prop in input) {
			if (prop) {
				self[prop] = input[prop];
			}
		}

		this.date = new Date(this.timestamp * 1000);
		this.amount = new BigNumber(input.amount).toNumber();
		this.fee = new BigNumber(input.fee).toNumber();
		this.typeGroup = input.typeGroup || 1;
		delete self.network;
		return self;
	}

	getAmount(forceFee?: boolean) {
		let amount = new BigNumber(this.amount);

		if (this.isSender() || forceFee) {
			amount = amount.plus(this.fee);
		}

		if (this.isMultipayment()) {
			for (const payment of this.asset.payments) {
				if (this.isSender() && this.address === payment.recipientId) {
					continue;
				} else if (
					!this.isSender() &&
					this.address !== payment.recipientId
				) {
					continue;
				}
				// @ts-ignore
				amount = amount.plus(payment.amount);
			}
		}

		return amount.toNumber();
	}

	getAmountEquivalent(
		marketCurrency: MarketCurrency,
		market: MarketTicker | MarketHistory,
	): number {
		if (!market || !marketCurrency) {
			return 0;
		}

		let price = 0;
		if (market instanceof MarketTicker) {
			const currency = market
				? market.getCurrency({ code: marketCurrency.code })
				: null;
			price = currency ? currency.price : 0;
		} else {
			price = market.getPriceByDate(marketCurrency.code, this.date);

			if (!price) {
				price = market.getPriceByDate(
					marketCurrency.code,
					moment(this.date).subtract(1, "d").toDate(),
				);
			}
		}

		const amount = ArkUtility.arktoshiToArk(this.getAmount(), true);
		const raw = amount * price;

		return isNaN(raw) ? 0 : raw;
	}

	getAppropriateAddress() {
		if (this.isTransfer()) {
			if (this.isSender()) {
				return this.recipientId;
			} else if (this.isReceiver()) {
				return this.senderId;
			}
		}
	}

	getTypeLabel(): string {
		let type = TX_TYPES[this.typeGroup][this.type];

		if (this.isTransfer() && !this.isSender()) {
			type = "TRANSACTIONS_PAGE.RECEIVED";
		}
		if (this.type === TransactionType.Vote && this.isUnvote()) {
			type = "DELEGATES_PAGE.UNVOTE";
		}

		return type;
	}

	getActivityLabel() {
		let type = TX_TYPES_ACTIVITY[this.typeGroup][this.type];

		if (this.isTransfer() && !this.isSender()) {
			type = "TRANSACTIONS_PAGE.RECEIVED_FROM";
		}
		if (this.type === TransactionType.Vote && this.isUnvote()) {
			type = "DELEGATES_PAGE.UNVOTE";
		}

		return type;
	}

	isMultipayment(): boolean {
		return (
			this.type === TRANSACTION_TYPES.GROUP_1.MULTI_PAYMENT &&
			this.typeGroup === TRANSACTION_GROUPS.STANDARD
		);
	}

	isTransfer(): boolean {
		return (
			this.type === TransactionType.SendArk &&
			this.typeGroup === TRANSACTION_GROUPS.STANDARD
		);
	}

	isSender(): boolean {
		return this.senderId === this.address;
	}

	isReceiver(): boolean {
		return this.recipientId === this.address;
	}

	isUnvote(): boolean {
		if (this.asset && this.asset.votes) {
			const vote = this.asset.votes[0];
			return vote.startsWith("-");
		}
		return false;
	}
}
