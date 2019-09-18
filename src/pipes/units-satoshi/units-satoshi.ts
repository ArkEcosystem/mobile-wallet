import { Pipe, PipeTransform } from '@angular/core';
import { ArkUtility } from '../../utils/ark-utility';

@Pipe({
  name: 'unitsSatoshi',
})
export class UnitsSatoshiPipe implements PipeTransform {

  transform(value: number | string, returnRaw: boolean = true) {
    if (typeof value === 'string') { value = Number(value); }

    return ArkUtility.subToUnit(value, returnRaw);
  }
}
