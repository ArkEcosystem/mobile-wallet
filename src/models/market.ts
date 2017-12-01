import lodash from 'lodash';

export interface Currency {
  code?: string;
  name?: string;
  symbol?: string;
}

export const CURRENCIES_LIST: Currency[] = [
  {
    code: "btc",
    name: "Bitcoin",
    symbol: "Ƀ",
  },
  {
    code: "usd",
    name: "Dollar",
    symbol: "$",
  },
  {
    code: "eur",
    name: "Euro",
    symbol: "€",
  },
  {
    code: "gbp",
    name: "British Pound",
    symbol: "£",
  },
  {
    code: "krw",
    name: "South Korean Won",
    symbol: "₩",
  },
  {
    code: "cny",
    name: "Chinese Yuan",
    symbol: "CN¥",
  },
  {
    code: "jpy",
    name: "Japanese Yen",
    symbol: "¥",
  },
  {
    code: "aud",
    name: "Australian Dollar",
    symbol: "A$",
  },
  {
    code: "cad",
    name: "Canadian Dollar",
    symbol: "CA$",
  },
  {
    code: "rub",
    name: "Russian Ruble",
    symbol: "RUB",
  },
  {
    code: "inr",
    name: "Indian Rupee",
    symbol: "₹",
  },
  {
    code: "brl",
    name: "Brazilian Real",
    symbol: "R$",
  },
  {
    code: "chf",
    name: "Swiss Franc",
    symbol: "CHF",
  },
  {
    code: "hkd",
    name: "Hong Kong Dollar",
    symbol: "HK$",
  },
  {
    code: "idr",
    name: "Indonesian Rupiah",
    symbol: "IDR",
  },
  {
    code: "mxn",
    name: "Mexican Peso",
    symbol: "MX$",
  },
];

export class MarketCurrency implements Currency {
  code: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume: number;

  fromCurrency(currency: Currency) {
    this.code = currency.code;
    this.name = currency.name;
    this.symbol = currency.symbol;
  }
}

export class MarketInfo {
  category: string;
  identifier: string;
  name: string;
  position: number;
  symbol: string;
}

export class MarketTicker {
  date: Date;
  timestamp: number;
  change1h: number;
  change7d: number;
  change24h: number;
  info: MarketInfo;
  market: MarketCurrency[];

  constructor(data?: any) {
    if (!data) return;

    let self: any = this;

    for (let prop in data) {
      self[prop] = data[prop];
    }

    return self;
  }

  getCurrency(query: any): MarketCurrency {
    return lodash.find(this.market, query);
  }

  deserialize(input: any, currenciesPrices?: any): MarketTicker {
    let self: any = this;
    if (!input || !lodash.isObject(input)) return;

    let inputMarket = input.markets ? input.markets[0] : input;

    self.timestamp = inputMarket.last_updated || input.timestamp;
    self.date = new Date(self.timestamp * 1000);
    self.change1h = inputMarket.percent_change_1h || inputMarket.change1h || null;
    self.change7d = inputMarket.percent_change_7d || inputMarket.change7d || null;
    self.change24h = inputMarket.percent_change_24h || inputMarket.change24h || null;

    self.info = {
      category: inputMarket.category || null,
      identifier: inputMarket.id || inputMarket.identifier,
      name: inputMarket.name,
      position: inputMarket.rank || inputMarket.position,
      symbol: inputMarket.symbol,
    }

    let currencies: MarketCurrency[] = [];

    for (let currency of CURRENCIES_LIST) {
      let marketCurrency: MarketCurrency = new MarketCurrency();
      marketCurrency.fromCurrency(currency);

      marketCurrency.price = 0.0;
      marketCurrency.marketCap = 0.0;
      marketCurrency.volume = 0.0;

      if (inputMarket.price) {
        marketCurrency.price = inputMarket.price[currency.code];
      } else if (currenciesPrices && currenciesPrices[marketCurrency.code]) {
        marketCurrency.price = currenciesPrices[marketCurrency.code];
      }
      if (inputMarket.marketCap) {
        marketCurrency.marketCap = inputMarket.marketCap[currency.code];
      } else if (currenciesPrices && currenciesPrices[marketCurrency.code]) {
        marketCurrency.marketCap = currenciesPrices[marketCurrency.code] * inputMarket.available_supply;
      }
      if (inputMarket.volume24) {
        marketCurrency.volume = inputMarket.volume24[currency.code];
      } else if (currenciesPrices && currenciesPrices[marketCurrency.code]) {
        marketCurrency.volume = currenciesPrices[marketCurrency.code] * (inputMarket['24h_volume_usd'] / inputMarket.price_usd);
      }

      currencies.push(marketCurrency);
    }

    self.market = currencies;

    return self;
  }
}

export class MarketHistory {
  history: any;

  deserialize(input: any): MarketHistory {
    let self: any = this;
    if (!Array.isArray(input)) return;

    let history = {};

    for (let ticker of input) {
      let obj = new MarketTicker().deserialize(ticker);
      let date = obj.date.setHours(0, 0, 0, 0);

      history[date] = obj;
    }

    self.history = history;

    return self;
  }

  findDate(date: Date): MarketTicker {
    let timestampDate = date.setHours(0, 0, 0, 0);

    return new MarketTicker(this.history[timestampDate]);
  }

  getLastWeekPrice(currencyCode: string): any {
    let tickers: MarketTicker[] = lodash(this.history).values().takeRight(7).value();

    let dates = lodash.map(tickers, (t) => t.date);
    let prices = lodash.map(tickers, (t) => t.getCurrency({ code: currencyCode }).price);

    return { dates, prices };
  }
}
