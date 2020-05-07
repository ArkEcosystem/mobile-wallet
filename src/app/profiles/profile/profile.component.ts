import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";

import { ProfileState } from "../shared/profile.state";
import { Profile } from "../shared/profile.types";

@Component({
	selector: "profile",
	templateUrl: "profile.component.html",
})
export class ProfileComponent implements OnInit {
	public profile$: Observable<Profile>;

	constructor(private store: Store, private route: ActivatedRoute) {}

	ngOnInit() {
		this.profile$ = this.route.params.pipe(
			switchMap((params) =>
				this.store.select(ProfileState.profileById(params.profileId)),
			),
		);
	}
}
