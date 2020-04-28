import { CURRENCIES } from "@arkecosystem/platform-sdk/dist/price-trackers/config";
import { HistoricalData as SdkHistoricalData } from "@arkecosystem/platform-sdk/dist/price-trackers/contracts/historical";
import { MarketData as SdkMarketData } from "@arkecosystem/platform-sdk/dist/price-trackers/contracts/market";

export type MarketProvider = "coincap" | "coingecko" | "cryptocompare";
export type MarketData = SdkMarketData & {
	currency: number | string;
	change24h: number | null;
};
export type MarketHistoricalData = SdkHistoricalData;

export type MarketCurrency = keyof typeof CURRENCIES;
