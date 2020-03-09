import { Pipe, PipeTransform } from "@angular/core";

import { ContactsProvider } from "@/services/contacts/contacts";
import { UserDataProvider } from "@/services/user-data/user-data";

@Pipe({
	name: "accountLabel",
})
export class AccountLabelPipe implements PipeTransform {
	constructor(
		private userDataProvider: UserDataProvider,
		private contactsProvider: ContactsProvider,
	) {}

	transform(value: string, defaultText?: string) {
		const contact = this.contactsProvider.getContactByAddress(value);
		if (contact) {
			return contact.name;
		}

		const label = this.userDataProvider.getWalletLabel(value);
		if (label) {
			return label;
		}

		if (defaultText) {
			return defaultText;
		}

		return value;
	}
}
