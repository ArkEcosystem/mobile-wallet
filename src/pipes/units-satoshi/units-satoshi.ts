import { Pipe, PipeTransform } from '@angular/core';
import { ARKTOSHI_DP, WALLET_UNIT_TO_SATOSHI } from '@app/app.constants';
import { BigNumber } from 'bignumber.js';

@Pipe({
  name: 'unitsSatoshi',
})
export class UnitsSatoshiPipe implements PipeTransform {

  transform(value: number | string, returnRaw: boolean = false) {
    if (typeof value === 'string') value = Number(value);

    let result: any = value / WALLET_UNIT_TO_SATOSHI;

    if (!returnRaw) {
      result = Number((new BigNumber(result.toString())).toFixed(ARKTOSHI_DP));
    }

    return result;
  }
}
