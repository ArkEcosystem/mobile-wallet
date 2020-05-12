import { Component, Input, OnInit } from "@angular/core";

import { Profile } from "../shared/profile.types";

@Component({
	selector: "profile-list",
	templateUrl: "profile-list.component.html",
})
export class ProfileListComponent implements OnInit {
	@Input()
	public profiles: Profile[];

	constructor() {}

	ngOnInit() {}
}
