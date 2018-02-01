import * as constants from '@app/app.constants';
import BigNumber from "bignumber.js";

export class ArkUtility {
  public static arktoshiToArk(ark: number, returnRaw: boolean = false): number {
    let result: number = ark / constants.WALLET_UNIT_TO_SATOSHI;

    if (!returnRaw) {
      result = Number((new BigNumber(result.toString())).toFixed(constants.ARKTOSHI_DP));
    }

    return result;
  }
}
