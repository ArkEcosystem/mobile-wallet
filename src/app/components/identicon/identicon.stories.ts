import { moduleMetadata, storiesOf } from "@storybook/angular";

import { IdenticonComponent } from "./identicon.component";

storiesOf("identicon", module)
	.addDecorator(
		moduleMetadata({
			declarations: [IdenticonComponent],
			imports: [],
		}),
	)
	.add("Default", () => ({
		component: IdenticonComponent,
		template: `
			<div class="flex p-5">
				<identicon value="AXzxJ8Ts3dQ2bvBR1tPE7GUee9iSEJb8HX" class="w-16 h-16 mr-2"></identicon>
				<identicon value="AHJJ29sCdR5UNZjdz3BYeDpvvkZCGBjde9" class="w-16 h-16 mr-2"></identicon>
				<identicon value="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" class="w-16 h-16 mr-2"></identicon>
				<identicon value="AXxNbmaKspf9UqgKhfTRDdn89NidP2gXWh" class="w-16 h-16 mr-2"></identicon>
				<identicon value="Aakg29vVhQhJ5nrsAHysTUqkTBVfmgBSXU" class="w-16 h-16"></identicon>
			</div>
		`,
	}));
