import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToTime',
})
export class SecondsToTimePipe implements PipeTransform {

  transform(value: number, ...args) {
    return new Date(0, 0, 0).setSeconds(value);
  }

}
