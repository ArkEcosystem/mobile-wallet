import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateMiddle',
})
export class TruncateMiddlePipe implements PipeTransform {

  transform(value: string, limit: number, originalValue: string, ...args) {
    if (originalValue && value !== originalValue) {
      return value;
    }

    if (value.length <= limit) {
      return value;
    }

    const lenghtTruncation = Math.floor((limit - 1) / 2);
    const leftData = value.slice(0, lenghtTruncation);
    const rightData = value.slice(value.length - lenghtTruncation);

    return `${leftData}...${rightData}`;
  }
}
