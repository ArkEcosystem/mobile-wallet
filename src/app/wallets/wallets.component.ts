import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
	selector: "wallets",
	templateUrl: "wallets.component.html",
})
export class WalletsComponent implements OnInit {
	constructor(private route: ActivatedRoute) {}

	ngOnInit() {
		this.route.params.subscribe(console.log);
	}
}
