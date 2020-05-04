import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
	selector: "profile",
	templateUrl: "profile.component.html",
})
export class ProfileComponent implements OnInit {
	constructor(private route: ActivatedRoute) {}

	ngOnInit() {
		this.route.params.subscribe(console.log);
	}
}
