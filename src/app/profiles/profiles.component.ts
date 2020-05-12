import { Component, OnInit } from "@angular/core";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";

import { ProfileState } from "./shared/profile.state";
import { Profile } from "./shared/profile.types";

@Component({
	selector: "profiles",
	templateUrl: "profiles.component.html",
	styleUrls: ["profiles.component.pcss"],
})
export class ProfilesComponent implements OnInit {
	@Select(ProfileState.profiles)
	public profiles$: Observable<Profile[]>;

	constructor() {}

	ngOnInit() {
		this.profiles$.subscribe(console.log);
	}
}
