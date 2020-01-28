import { Component } from "@angular/core";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";
import { SettingsStateModel } from "./shared/settings.model";
import { SETTINGS_STATE_TOKEN } from "./shared/settings.state";

@Component({
	templateUrl: "settings.component.html",
})
export class SettingsComponent {
	@Select(SETTINGS_STATE_TOKEN) public settings$: Observable<
		SettingsStateModel
	>;

	constructor() {}
}
