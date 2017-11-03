import { Pipe, PipeTransform } from '@angular/core';
import { WALLET_UNIT_TO_SATOSHI } from '@app/app.constants';

@Pipe({
  name: 'unitsSatoshi',
})
export class UnitsSatoshiPipe implements PipeTransform {

  transform(value: number | string, parse: boolean = false, ...args) {
    if (typeof value === 'string') value = Number(value);

    let result = value / WALLET_UNIT_TO_SATOSHI;

    if (parse) result = Math.trunc(result);

    return result;
  }
}
