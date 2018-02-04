import lodash from 'lodash';

export interface Currency {
  code?: string;
  name?: string;
  symbol?: string;
}

export const CURRENCIES_LIST: Currency[] = [
  {
    code: 'btc',
    name: 'Bitcoin',
    symbol: 'Ƀ',
  },
  {
    code: 'usd',
    name: 'Dollar',
    symbol: '$',
  },
  {
    code: 'eur',
    name: 'Euro',
    symbol: '€',
  },
  {
    code: 'gbp',
    name: 'British Pound',
    symbol: '£',
  },
  {
    code: 'krw',
    name: 'South Korean Won',
    symbol: '₩',
  },
  {
    code: 'cny',
    name: 'Chinese Yuan',
    symbol: 'CN¥',
  },
  {
    code: 'jpy',
    name: 'Japanese Yen',
    symbol: '¥',
  },
  {
    code: 'aud',
    name: 'Australian Dollar',
    symbol: 'A$',
  },
  {
    code: 'cad',
    name: 'Canadian Dollar',
    symbol: 'CA$',
  },
  {
    code: 'rub',
    name: 'Russian Ruble',
    symbol: 'RUB',
  },
  {
    code: 'inr',
    name: 'Indian Rupee',
    symbol: '₹',
  },
  {
    code: 'brl',
    name: 'Brazilian Real',
    symbol: 'R$',
  },
  {
    code: 'chf',
    name: 'Swiss Franc',
    symbol: 'CHF',
  },
  {
    code: 'hkd',
    name: 'Hong Kong Dollar',
    symbol: 'HK$',
  },
  {
    code: 'idr',
    name: 'Indonesian Rupiah',
    symbol: 'IDR',
  },
  {
    code: 'mxn',
    name: 'Mexican Peso',
    symbol: 'MX$',
  },
];

export class MarketCurrency implements Currency {
  code: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume: number;
  date: Date;
  timestamp: number;
  change24h: number;

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
  info: MarketInfo;
  market: MarketCurrency[];

  constructor(data?: any) {
    if (!data) { return; }

    const self: any = this;

    for (const prop in data) {
      self[prop] = data[prop];
    }

    return self;
  }

  getCurrency(query: any): MarketCurrency {
    return lodash.find(this.market, query);
  }

  deserialize(input: any): MarketTicker {
    const self: any = this;
    if (!input || !lodash.isObject(input)) { return; }

    self.info = {
      identifier: input.symbol,
      name: input.symbol,
      symbol: input.symbol,
    };

    const currencies: MarketCurrency[] = [];

    for (const currency of CURRENCIES_LIST) {
      const currencyCode = currency.code.toUpperCase();
      const marketCurrency: MarketCurrency = new MarketCurrency();
      marketCurrency.fromCurrency(currency);

      marketCurrency.price = 0.0;
      marketCurrency.marketCap = 0.0;
      marketCurrency.volume = 0.0;
      marketCurrency.timestamp = 0;
      marketCurrency.date = null;
      marketCurrency.change24h = 0;

      if (input['currencies'] && input.currencies[currencyCode]) {
        marketCurrency.price = input.currencies[currencyCode].PRICE;
        marketCurrency.marketCap = input.currencies[currencyCode].MKTCAP;
        marketCurrency.volume = input.currencies[currencyCode].SUPPLY;
        marketCurrency.timestamp = input.currencies[currencyCode].time;
        marketCurrency.date = new Date(marketCurrency.timestamp * 1000);
        marketCurrency.change24h = input.currencies[currencyCode].CHANGEPCT24HOUR || null;
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
    const self: any = this;
    if (!input || !lodash.isObject(input)) { return; }

    const history = {};

    for (const currency in input) {
      for (const data of input[currency]) {
        const date = (new Date(data.time * 1000)).setHours(0, 0, 0, 0);
        if (!history[currency]) {
          history[currency] = {};
        }
        history[currency][date] = data.close;
      }
    }

    self.history = history;

    return self;
  }

  getPriceByDate(currencyCode: string, date: Date): number {
    const timestampDate = date.setHours(0, 0, 0, 0);

    return this.history[currencyCode.toUpperCase()][timestampDate];
  }

  getLastWeekPrice(currencyCode: string): any {
    const dates = lodash(this.history[currencyCode]).keys().takeRight(7).value().map((date) => new Date(parseInt(date)));
    const prices = lodash(this.history[currencyCode]).values().takeRight(7).value();

    return { dates, prices };
  }
}
