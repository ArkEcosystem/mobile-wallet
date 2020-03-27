import { Pipe, PipeTransform } from "@angular/core";

import { AccountLabelPipe } from "@/pipes/account-label/account-label";
import { ContactsProvider } from "@/services/contacts/contacts";
import { UserDataService } from "@/services/user-data/user-data.interface";

@Pipe({
	name: "hasAccountLabel",
})
export class HasAccountLabelPipe implements PipeTransform {
	private accountLabelPipe: AccountLabelPipe;

	constructor(
		userDataProvider: UserDataService,
		contactsProvider: ContactsProvider,
	) {
		this.accountLabelPipe = new AccountLabelPipe(
			userDataProvider,
			contactsProvider,
		);
	}

	public transform(address: string): boolean {
		return this.accountLabelPipe.transform(address, null) !== address;
	}
}
