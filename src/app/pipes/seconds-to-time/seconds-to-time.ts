import { Pipe, PipeTransform } from "@angular/core";
import dayjs from "dayjs";

@Pipe({
	name: "secondsToTime",
})
export class SecondsToTimePipe implements PipeTransform {
	transform(value: number, ...args) {
		return dayjs().startOf("hour").set("second", value).toDate();
	}
}
