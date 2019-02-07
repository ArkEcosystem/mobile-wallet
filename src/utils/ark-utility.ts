import * as constants from '@app/app.constants';
import BigNumber from 'bignumber.js';

export class ArkUtility {
  public static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public static arktoshiToArk(arktoshi: number, returnRaw: boolean = false): number {
    let result: number = arktoshi / constants.WALLET_UNIT_TO_SATOSHI;

    if (!returnRaw) {
      result = Number((new BigNumber(result.toString())).toFixed(constants.ARKTOSHI_DP));
    }

    return result;
  }

  public static subToUnit(value: number | string, parseScientificNotation: boolean = true) {
    if (!value) {
      return '';
    }

    let amount = new BigNumber(value.toString()).dividedBy(constants.WALLET_UNIT_TO_SATOSHI).toString();

    // Convert the fee to String to not use the exponential notation
    if (parseScientificNotation) {
      const parts = amount.split('e-');
      if (parts.length > 1) {
        amount = parseFloat(amount).toFixed(parseInt(parts[1]));
      }
    }

    return amount;
  }

  public static unitToSub(value: number|string) {
    if (!value) {
      return '';
    }

    return new BigNumber(value.toString()).multipliedBy(constants.WALLET_UNIT_TO_SATOSHI).toString();
  }
}
