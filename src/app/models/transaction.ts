import { Interfaces } from "@arkecosystem/crypto";
import { Transaction as TransactionModel } from "ark-ts/model";
import moment from "moment";

import {
	TRANSACTION_GROUPS,
	TRANSACTION_TYPES,
	TRANSACTION_TYPES_ENTITY,
} from "@/app/app.constants";
import { MarketCurrency, MarketHistory, MarketTicker } from "@/models/market";
import { SafeBigNumber as BigNumber } from "@/utils/bignumber";

import { ArkUtility } from "../utils/ark-utility";

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
		this.senderId = input.sender;
		this.recipientId = input.recipient;
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
		if (this.isTransfer()) {
			if (this.isSender()) {
				return "TRANSACTIONS_PAGE.SENT";
			}
			return "TRANSACTIONS_PAGE.RECEIVED";
		}
		if (this.isSecondSignature()) {
			return "TRANSACTIONS_PAGE.SECOND_SIGNATURE_CREATION";
		}
		if (this.isDelegateRegistration()) {
			return "TRANSACTIONS_PAGE.DELEGATE_REGISTRATION";
		}
		if (this.isVote()) {
			return "DELEGATES_PAGE.VOTE";
		}
		if (this.isUnvote()) {
			return "DELEGATES_PAGE.UNVOTE";
		}
		if (this.isMultiSignature()) {
			return "TRANSACTIONS_PAGE.MULTISIGNATURE_REGISTRATION";
		}
		if (this.isIpfs()) {
			return "TRANSACTIONS_PAGE.IPFS";
		}
		if (this.isMultipayment()) {
			return "TRANSACTIONS_PAGE.MULTI_PAYMENT";
		}
		if (this.isDelegateResignation()) {
			return "TRANSACTIONS_PAGE.DELEGATE_RESIGNATION";
		}
		if (this.isTimelock()) {
			return "TRANSACTIONS_PAGE.HTLC_LOCK";
		}
		if (this.isTimelockClaim()) {
			return "TRANSACTIONS_PAGE.HTLC_CLAIM";
		}
		if (this.isTimelockRefund()) {
			return "TRANSACTIONS_PAGE.HTLC_REFUND";
		}

		// Magistrate
		if (this.isLegacyBusinessRegistration()) {
			return "TRANSACTIONS_PAGE.LEGACY_BUSINESS_REGISTRATION";
		}
		if (this.isLegacyBusinessResignation()) {
			return "TRANSACTIONS_PAGE.LEGACY_BUSINESS_RESIGNATION";
		}
		if (this.isLegacyBusinessUpdate()) {
			return "TRANSACTIONS_PAGE.LEGACY_BUSINESS_UPDATE";
		}
		if (this.isLegacyBridgechainRegistration()) {
			return "TRANSACTIONS_PAGE.LEGACY_BRIDGECHAIN_REGISTRATION";
		}
		if (this.isLegacyBridgechainResignation()) {
			return "TRANSACTIONS_PAGE.LEGACY_BRIDGECHAIN_RESIGNATION";
		}
		if (this.isLegacyBridgechainUpdate()) {
			return "TRANSACTIONS_PAGE.LEGACY_BRIDGECHAIN_UPDATE";
		}

		// Magistrate 2.0
		if (this.isBusinessEntityRegistration()) {
			return "TRANSACTIONS_PAGE.BUSINESS_ENTITY_REGISTRATION";
		}
		if (this.isBusinessEntityResignation()) {
			return "TRANSACTIONS_PAGE.BUSINESS_ENTITY_REGISTRATION";
		}
		if (this.isBusinessEntityUpdate()) {
			return "TRANSACTIONS_PAGE.BUSINESS_ENTITY_UPDATE";
		}
		if (this.isDeveloperEntityRegistration()) {
			return "TRANSACTIONS_PAGE.DEVELOPER_ENTITY_REGISTRATION";
		}
		if (this.isDeveloperEntityResignation()) {
			return "TRANSACTIONS_PAGE.DEVELOPER_ENTITY_REGISTRATION";
		}
		if (this.isDeveloperEntityUpdate()) {
			return "TRANSACTIONS_PAGE.DEVELOPER_ENTITY_UPDATE";
		}
		if (this.isCorePluginEntityRegistration()) {
			return "TRANSACTIONS_PAGE.CORE_PLUGIN_ENTITY_REGISTRATION";
		}
		if (this.isCorePluginEntityResignation()) {
			return "TRANSACTIONS_PAGE.CORE_PLUGIN_ENTITY_REGISTRATION";
		}
		if (this.isCorePluginEntityUpdate()) {
			return "TRANSACTIONS_PAGE.CORE_PLUGIN_ENTITY_UPDATE";
		}
		if (this.isDesktopPluginEntityRegistration()) {
			return "TRANSACTIONS_PAGE.DESKTOP_PLUGIN_ENTITY_REGISTRATION";
		}
		if (this.isDesktopPluginEntityResignation()) {
			return "TRANSACTIONS_PAGE.DESKTOP_PLUGIN_ENTITY_REGISTRATION";
		}
		if (this.isDesktopPluginEntityUpdate()) {
			return "TRANSACTIONS_PAGE.DESKTOP_PLUGIN_ENTITY_UPDATE";
		}
		if (this.isDelegateEntityRegistration()) {
			return "TRANSACTIONS_PAGE.DELEGATE_ENTITY_REGISTRATION";
		}
		if (this.isDelegateEntityResignation()) {
			return "TRANSACTIONS_PAGE.DELEGATE_ENTITY_REGISTRATION";
		}
		if (this.isDelegateEntityUpdate()) {
			return "TRANSACTIONS_PAGE.DELEGATE_ENTITY_UPDATE";
		}

		if (this.isUndefinedRegistration()) {
			return "TRANSACTIONS_PAGE.UNDEFINED_REGISTRATION";
		}
		if (this.isUndefinedResignation()) {
			return "TRANSACTIONS_PAGE.UNDEFINED_RESIGNATION";
		}
		if (this.isUndefinedUpdate()) {
			return "TRANSACTIONS_PAGE.UNDEFINED_UPDATE";
		}

		return "TRANSACTIONS_PAGE.UNDEFINED";
	}

	getActivityLabel() {
		return this.getTypeLabel();
	}

	isTransfer() {
		return (
			this.type === TRANSACTION_TYPES.GROUP_1.TRANSFER &&
			this.typeGroup === TRANSACTION_GROUPS.STANDARD
		);
	}

	isSecondSignature() {
		return (
			this.type === TRANSACTION_TYPES.GROUP_1.SECOND_SIGNATURE &&
			this.typeGroup === TRANSACTION_GROUPS.STANDARD
		);
	}

	isDelegateRegistration() {
		return (
			this.type === TRANSACTION_TYPES.GROUP_1.DELEGATE_REGISTRATION &&
			this.typeGroup === TRANSACTION_GROUPS.STANDARD
		);
	}

	isVote() {
		return (
			this.type === TRANSACTION_TYPES.GROUP_1.VOTE &&
			this.typeGroup === TRANSACTION_GROUPS.STANDARD
		);
	}

	isMultiSignature() {
		return (
			this.type === TRANSACTION_TYPES.GROUP_1.MULTI_SIGNATURE &&
			this.typeGroup === TRANSACTION_GROUPS.STANDARD
		);
	}

	isIpfs() {
		return (
			this.type === TRANSACTION_TYPES.GROUP_1.IPFS &&
			this.typeGroup === TRANSACTION_GROUPS.STANDARD
		);
	}

	isMultipayment() {
		return (
			this.type === TRANSACTION_TYPES.GROUP_1.MULTI_PAYMENT &&
			this.typeGroup === TRANSACTION_GROUPS.STANDARD
		);
	}

	isDelegateResignation() {
		return (
			this.type === TRANSACTION_TYPES.GROUP_1.DELEGATE_RESIGNATION &&
			this.typeGroup === TRANSACTION_GROUPS.STANDARD
		);
	}

	isTimelock() {
		return (
			this.type === TRANSACTION_TYPES.GROUP_1.HTLC_LOCK &&
			this.typeGroup === TRANSACTION_GROUPS.STANDARD
		);
	}

	isTimelockClaim() {
		return (
			this.type === TRANSACTION_TYPES.GROUP_1.HTLC_CLAIM &&
			this.typeGroup === TRANSACTION_GROUPS.STANDARD
		);
	}

	isTimelockRefund() {
		return (
			this.type === TRANSACTION_TYPES.GROUP_1.HTLC_REFUND &&
			this.typeGroup === TRANSACTION_GROUPS.STANDARD
		);
	}

	// Magistrate 2.0

	isEntityRegistration() {
		return (
			this.type === TRANSACTION_TYPES.GROUP_2.ENTITY &&
			this.typeGroup === TRANSACTION_GROUPS.MAGISTRATE &&
			this.asset &&
			this.asset.action === TRANSACTION_TYPES_ENTITY.ACTION.REGISTER
		);
	}

	isEntityResignation() {
		return (
			this.type === TRANSACTION_TYPES.GROUP_2.ENTITY &&
			this.typeGroup === TRANSACTION_GROUPS.MAGISTRATE &&
			this.asset &&
			this.asset.action === TRANSACTION_TYPES_ENTITY.ACTION.RESIGN
		);
	}

	isEntityUpdate() {
		return (
			this.type === TRANSACTION_TYPES.GROUP_2.ENTITY &&
			this.typeGroup === TRANSACTION_GROUPS.MAGISTRATE &&
			this.asset &&
			this.asset.action === TRANSACTION_TYPES_ENTITY.ACTION.UPDATE
		);
	}

	isBusinessEntityRegistration() {
		return (
			this.isEntityRegistration() &&
			this.asset.type === TRANSACTION_TYPES_ENTITY.TYPE.BUSINESS &&
			this.asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
		);
	}

	isBusinessEntityResignation() {
		return (
			this.isEntityResignation() &&
			this.asset.type === TRANSACTION_TYPES_ENTITY.TYPE.BUSINESS &&
			this.asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
		);
	}

	isBusinessEntityUpdate() {
		return (
			this.isEntityUpdate() &&
			this.asset.type === TRANSACTION_TYPES_ENTITY.TYPE.BUSINESS &&
			this.asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
		);
	}

	isDeveloperEntityRegistration() {
		return (
			this.isEntityRegistration() &&
			this.asset.type === TRANSACTION_TYPES_ENTITY.TYPE.DEVELOPER &&
			this.asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
		);
	}

	isDeveloperEntityResignation() {
		return (
			this.isEntityResignation() &&
			this.asset.type === TRANSACTION_TYPES_ENTITY.TYPE.DEVELOPER &&
			this.asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
		);
	}

	isDeveloperEntityUpdate() {
		return (
			this.isEntityUpdate() &&
			this.asset.type === TRANSACTION_TYPES_ENTITY.TYPE.DEVELOPER &&
			this.asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
		);
	}

	isCorePluginEntityRegistration() {
		return (
			this.isEntityRegistration() &&
			this.asset.type === TRANSACTION_TYPES_ENTITY.TYPE.PLUGIN &&
			this.asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.PLUGIN_CORE
		);
	}

	isCorePluginEntityResignation() {
		return (
			this.isEntityResignation() &&
			this.asset.type === TRANSACTION_TYPES_ENTITY.TYPE.PLUGIN &&
			this.asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.PLUGIN_CORE
		);
	}

	isCorePluginEntityUpdate() {
		return (
			this.isEntityUpdate() &&
			this.asset.type === TRANSACTION_TYPES_ENTITY.TYPE.PLUGIN &&
			this.asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.PLUGIN_CORE
		);
	}

	isDesktopPluginEntityRegistration() {
		return (
			this.isEntityRegistration() &&
			this.asset.type === TRANSACTION_TYPES_ENTITY.TYPE.PLUGIN &&
			this.asset.subType ===
				TRANSACTION_TYPES_ENTITY.SUBTYPE.PLUGIN_DESKTOP
		);
	}

	isDesktopPluginEntityResignation() {
		return (
			this.isEntityResignation() &&
			this.asset.type === TRANSACTION_TYPES_ENTITY.TYPE.PLUGIN &&
			this.asset.subType ===
				TRANSACTION_TYPES_ENTITY.SUBTYPE.PLUGIN_DESKTOP
		);
	}

	isDesktopPluginEntityUpdate() {
		return (
			this.isEntityUpdate() &&
			this.asset.type === TRANSACTION_TYPES_ENTITY.TYPE.PLUGIN &&
			this.asset.subType ===
				TRANSACTION_TYPES_ENTITY.SUBTYPE.PLUGIN_DESKTOP
		);
	}

	isDelegateEntityRegistration() {
		return (
			this.isEntityRegistration() &&
			this.asset.type === TRANSACTION_TYPES_ENTITY.TYPE.DELEGATE &&
			this.asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
		);
	}

	isDelegateEntityResignation() {
		return (
			this.isEntityResignation() &&
			this.asset.type === TRANSACTION_TYPES_ENTITY.TYPE.DELEGATE &&
			this.asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
		);
	}

	isDelegateEntityUpdate() {
		return (
			this.isEntityUpdate() &&
			this.asset.type === TRANSACTION_TYPES_ENTITY.TYPE.DELEGATE &&
			this.asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
		);
	}

	// Magistrate 1.0

	isLegacyBusinessRegistration() {
		return (
			this.type === TRANSACTION_TYPES.GROUP_2.BUSINESS_REGISTRATION &&
			this.typeGroup === TRANSACTION_GROUPS.MAGISTRATE
		);
	}

	isLegacyBusinessResignation() {
		return (
			this.type === TRANSACTION_TYPES.GROUP_2.BUSINESS_RESIGNATION &&
			this.typeGroup === TRANSACTION_GROUPS.MAGISTRATE
		);
	}

	isLegacyBusinessUpdate() {
		return (
			this.type === TRANSACTION_TYPES.GROUP_2.BUSINESS_UPDATE &&
			this.typeGroup === TRANSACTION_GROUPS.MAGISTRATE
		);
	}

	isLegacyBridgechainRegistration() {
		return (
			this.type === TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_REGISTRATION &&
			this.typeGroup === TRANSACTION_GROUPS.MAGISTRATE
		);
	}

	isLegacyBridgechainResignation() {
		return (
			this.type === TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_RESIGNATION &&
			this.typeGroup === TRANSACTION_GROUPS.MAGISTRATE
		);
	}

	isLegacyBridgechainUpdate() {
		return (
			this.type === TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_UPDATE &&
			this.typeGroup === TRANSACTION_GROUPS.MAGISTRATE
		);
	}

	isUndefinedRegistration() {
		return (
			this.isEntityRegistration() &&
			!Object.values(TRANSACTION_TYPES_ENTITY.TYPE).includes(
				this.asset.type,
			)
		);
	}

	isUndefinedResignation() {
		return (
			this.isEntityResignation() &&
			!Object.values(TRANSACTION_TYPES_ENTITY.TYPE).includes(
				this.asset.type,
			)
		);
	}

	isUndefinedUpdate() {
		return (
			this.isEntityUpdate() &&
			!Object.values(TRANSACTION_TYPES_ENTITY.TYPE).includes(
				this.asset.type,
			)
		);
	}

	isSender() {
		return this.senderId === this.address;
	}

	isReceiver() {
		return this.recipientId === this.address;
	}

	isUnvote() {
		if (this.isVote() && this.asset && this.asset.votes) {
			const vote = this.asset.votes[0];
			return vote.startsWith("-");
		}
		return false;
	}
}
