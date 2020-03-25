import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";

import { DirectivesModule } from "@/directives/directives.module";

import { InputAddressComponent } from "./input-address.component";

describe("Input Address", () => {
	let spectator: SpectatorHost<InputAddressComponent>;
	const createHost = createHostFactory({
		component: InputAddressComponent,
		imports: [IonicModule, DirectivesModule, FormsModule],
	});

	// beforeAll(() => removeLogs());

	it("should work with ngModel", () => {
		const spectator = createHost(
			`<input-address [(ngModel)]="address"></input-address>`,
			{
				hostProps: {
					value: "abc",
				},
			},
		);
	});
});
