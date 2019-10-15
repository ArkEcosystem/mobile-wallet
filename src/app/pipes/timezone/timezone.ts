import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment-timezone';

@Pipe({
  name: 'timezone',
})
export class TimezonePipe implements PipeTransform {

  transform(value: string, ...args) {
    return moment(value).tz(moment.tz.guess()).format();
  }

}
