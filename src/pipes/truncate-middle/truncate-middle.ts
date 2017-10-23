import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateMiddle',
})
export class TruncateMiddlePipe implements PipeTransform {

  transform(value: string, limit: number, originalValue: string, ...args) {
    if (value != originalValue) {
      return value;
    }

    if (value.length <= limit) {
      return value;
    }

    let lenghtTruncation = Math.floor((limit - 1) / 2);
    let leftData = value.slice(0, lenghtTruncation);
    let rightData = value.slice(value.length - lenghtTruncation);

    return `${leftData}...${rightData}`;
  }
}
