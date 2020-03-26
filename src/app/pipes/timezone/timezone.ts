import { Pipe, PipeTransform } from "@angular/core";
import moment from "moment";

@Pipe({
	name: "timezone",
})
export class TimezonePipe implements PipeTransform {
	transform(value: number) {
		return moment.unix(value).local().toString();
	}
}
