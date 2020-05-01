import {
	HistoricalData as SdkHistoricalData,
	MarketData as SdkMarketData,
} from "@arkecosystem/platform-sdk/dist/contracts/price-trackers";
import { CURRENCIES } from "@arkecosystem/platform-sdk/dist/data/currencies";

export type MarketProvider = "coincap" | "coingecko" | "cryptocompare";
export type MarketData = SdkMarketData;
export type MarketHistoricalData = SdkHistoricalData;

export type MarketCurrency = keyof typeof CURRENCIES;
