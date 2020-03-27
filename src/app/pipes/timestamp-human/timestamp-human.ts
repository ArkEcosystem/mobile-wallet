import { Pipe, PipeTransform } from "@angular/core";
import moment from "moment";

import { SettingsDataProvider } from "@/services/settings-data/settings-data";

@Pipe({
	name: "timestampHuman",
})
export class TimestampHumanPipe implements PipeTransform {
	private language = "en";

	constructor(settingsDataProvider: SettingsDataProvider) {
		settingsDataProvider.settings.subscribe(
			(settings) => (this.language = settings.language),
		);
	}

	transform(value: string, ...args) {
		return moment(value).locale(this.language).fromNow();
	}
}
