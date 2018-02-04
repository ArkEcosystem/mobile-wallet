import { Pipe, PipeTransform } from '@angular/core';
import { SettingsDataProvider } from '@providers/settings-data/settings-data';
import moment from 'moment';

@Pipe({
  name: 'timestampHuman',
})
export class TimestampHumanPipe implements PipeTransform {

  private language = 'en';

  constructor(settingsDataProvider: SettingsDataProvider) {
    settingsDataProvider.settings.subscribe((settings) => this.language = settings.language);
  }

  transform(value: string, ...args) {
    return moment(value).locale(this.language).fromNow();
  }

}
