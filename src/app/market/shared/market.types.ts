export interface MarketData {
	currency: string;
	price: number;
	marketCap: number;
	volume: number;
	date: Date;
	change24h: number | null;
}

export type Currency =
	| "BTC"
	| "ETH"
	| "LTC"
	| "AUD"
	| "BRL"
	| "CAD"
	| "CHF"
	| "CNY"
	| "EUR"
	| "GBP"
	| "HKD"
	| "IDR"
	| "INR"
	| "JPY"
	| "KRW"
	| "MXN"
	| "RUB"
	| "USD";

export interface CurrencyFormat {
	code: string;
	crypto: boolean;
	symbol: string;
	groupSeparator: string;
	decimalSeparator: string;
	symbolOnLeft: boolean;
	spaceBetweenAmountAndSymbol: boolean;
	decimalDigits: number;
}
