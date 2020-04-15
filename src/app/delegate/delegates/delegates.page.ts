import { Component } from "@angular/core";

import { Delegate } from "../delegate.types";

@Component({
	templateUrl: "delegates.page.html",
	styleUrls: ["delegates.page.pcss"],
})
export class DelegatesPage {
	public delegates: Delegate[] = [
		{
			username: "genesis_1",
			rank: 1,
		},
		{
			username: "genesis_2",
			rank: 2,
		},
		{
			username: "genesis_3",
			rank: 3,
		},
		{
			username: "genesis_4",
			rank: 4,
		},
		{
			username: "genesis_5",
			rank: 5,
		},
		{
			username: "genesis_6",
			rank: 6,
		},
		{
			username: "genesis_7",
			rank: 7,
		},
		{
			username: "genesis_8",
			rank: 8,
		},
		{
			username: "genesis_9",
			rank: 9,
		},
		{
			username: "genesis_10",
			rank: 10,
		},
		{
			username: "genesis_11",
			rank: 11,
		},
	];

	constructor() {}
}
